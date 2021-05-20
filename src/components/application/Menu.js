import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { api, handleError } from '../../helpers/api';
import {useHistory, withRouter} from 'react-router-dom';
import './css/menu.css';
import {InvitationInjector} from "./menuAssets/InvitationInjector";
import {MenuGrid, MenuHeader} from "../../views/design/ElegantAssets";
import {RuleFramer, RuleItem} from "./menuAssets/JassEncyclopaedia";
import {UserList} from "./applicationAssets/UserList";



const Menu = () => {
  const [user] = useState(JSON.parse(sessionStorage.getItem('user')));
  const history = useHistory();

  /* add beforeunload event listener.
  What I actually wanted to achieve was for a user to get logged
  out once he closes the tab or the browser and stay logged in
  if he only refreshes or navigates. However this behaviour is
  not that easily achievable even though the W3C recommends
  the High Resolution Time Level 2 API
  (see https://www.w3.org/TR/hr-time-2/#sec-performance) to track
  navigation types. But even then, if we would completely want to
  rely on that API, we could not track if a client e.g. powers off
  its device by force and hence could not handle him being logged
  out correctly.
  Thus we need to establish another mechanic to log out a client
  properly in the backend. So I came up with another idea which
  we might want to consider as an issue for this project:
  Utilize cookies and stomp. Once a user logs in and gets redirected
  to the menu, he receives a cookie from the backend. The frontend
  must validate this cookie on a new page render and since the
  cookie may expire, the user shall be logged out in case of
  expiration. However, in order to advertise truthful online-status
  information for a specific user, we might utilize the TCP connection
  established by stomp such that in case the client's TCP connection
  with the backend gets teared down, his status is then set to
  offline in the backend. Once that client re-establishes his TCP
  connection, his cookie gets validated once again and if the cookie
  hasn't expired by then and only then does the backend set his
  status to online again, otherwise he gets logged out.
  -- I will leave this here as a note for myself and my project group.
   */
  useEffect(() => {

    // alerts user before page unloads (tab/browser close or refresh) to cancel unload if desired
    const onBeforeUnload = event => {
      event.preventDefault();
      return event.returnValue = '';
    };

    // event listener...
    window.addEventListener('beforeunload', onBeforeUnload);

    // ...aaaand clean it up
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [])

  const logout = async () => {
    /** uncomment the following, when the backend is set up accordingly **/
    try {
      // request a user status update of myself ONLINE -> OFFLINE
      const myToken = user.token;
      await api.put(`/users/logout/${myToken}`);

      // add http.status handlers here...

      // remove token from localStorage and sessionStorage and push login page
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      history.push('login');

    } catch (error) {
      alert(`Something went wrong while trying to logout:\n${handleError(error)}`);
    }
  }


  return (
      <MenuGrid>
        <InvitationInjector userId={user?.id}/>
        <MenuHeader
            user={user}
            onClickProfile={() => alert('Feature not yet implemented')}
            onClickCreate={() => history.push('/create')}
            onClickJoin={() => history.push({pathname: '/join', state: {user: user}})}
            onClickLogout={() => logout()}
        />
        <RuleFramer>
          <RuleItem heading={'Introduction to Jass'}>
            Cum capio peregrinationes, omnes lapsuses quaestio pius, grandis extumes.
            Domesticus, barbatus compaters interdum manifestum de rusticus, regius coordinatae.
            cum homo mori, omnes ignigenaes attrahendam fidelis, flavum lactaes.
            salvus, fatalis elogiums unus demitto de audax, fidelis torus.
            cum zelus studere, omnes gabaliumes locus secundus, camerarius glutenes.
            cum cannabis favere, omnes dominaes tractare varius, fatalis accolaes.
            alter, placidus imbers velox talem de regius, noster armarium.
            cum clinias ridetis, omnes cannabises resuscitabo altus, rusticus absolutioes.
          </RuleItem>
          <RuleItem heading={'The different Jass in-game modes'}>
            Cum solitudo mori, omnes devirginatoes locus raptus, noster lactaes.
            Domesticus, rusticus cedriums superbe manifestum de castus, fatalis clabulare.
            cum luna credere, omnes navises visum secundus, albus fugaes.
            emeritis, gratis ollas callide demitto de bi-color, dexter hibrida.
            cum lactea mori, omnes ionicis tormentoes magicae bi-color, placidus lunaes.
            cum habena trabem, omnes lumenes experientia magnum, pius fugaes.
            cum visus congregabo, omnes paluses convertam fidelis, emeritis cedriumes.
            salvus, camerarius elevatuss una consumere de barbatus, magnum mensa.
          </RuleItem>
          <RuleItem heading={'Specific rules'}>
            Cum cobaltum resistere, omnes scutumes imitari dexter, fatalis assimilatioes.
            Alter, talis tabess satis gratia de fatalis, lotus lamia.
            cum humani generis resistere, omnes contencioes aperto mirabilis, castus bullaes.
            bassus, brevis luras rare imperium de emeritis, fortis orexis.
            fortis, bi-color byssuss rare promissio de bassus, nobilis nixus.
            azureus, fidelis lixas cito dignus de fatalis, grandis historia.
            teres, castus repressors tandem gratia de clemens, bassus equiso.
            varius, audax speciess diligenter manifestum de placidus, superbus competition.
          </RuleItem>
          <RuleItem heading={'How does a single round with multiple tricks work'}>
            Cum abactus ridetis, omnes bromiumes attrahendam gratis, emeritis zirbuses.
            Cum agripeta prarere, omnes eraes captis rusticus, neuter devatioes.
            fortis, flavum absolutios virtualiter tractare de primus, raptus finis.
            regius, barbatus impositios vix imperium de fortis, castus uria.
            cum contencio crescere, omnes agripetaes demitto neuter, fidelis omniaes.
            regius, castus elogiums velox acquirere de salvus, brevis olla.
            cum ignigena favere, omnes fermiumes locus altus, placidus vigiles.
            regius, dexter deuss acceleratrix gratia de varius, camerarius lumen.
          </RuleItem>
          <RuleItem heading={'When is the game finished'}>
            Varius, mirabilis toruss aliquando imitari de magnum, peritus spatii.
            Nobilis, pius victrixs absolute quaestio de fatalis, fortis diatria.
            cum contencio congregabo, omnes victrixes fallere albus, dexter verpaes.
            cum solitudo studere, omnes onuses amor varius, bassus consiliumes.
            cum pars accelerare, omnes scutumes imperium bassus, rusticus heureteses.
            gratis, raptus fluctuis aliquando promissio de rusticus, magnum danista.
            cum ventus peregrinatione, omnes demissioes anhelare talis, audax aususes.
            cum usus manducare, omnes imberes amor grandis, neuter elevatuses.
          </RuleItem>
          <RuleItem heading={'Tricks, tips and advices'}>
            Cum clinias tolerare, omnes lubaes convertam barbatus, grandis particulaes.
            Teres, ferox nomens grauiter transferre de barbatus, camerarius cedrium.
            fatalis, regius acipensers rare imperium de barbatus, alter valebat.
            albus, flavum cobaltums vix experientia de fidelis, velox genetrix.
            albus, regius omnias satis reperire de talis, grandis aonides.
            cum bromium credere, omnes lumenes visum regius, azureus menses.
            magnum, germanus eras nunquam imitari de brevis, salvus tumultumque.
            flavum, mirabilis mineraliss velox locus de audax, dexter ausus.
          </RuleItem>
        </RuleFramer>
        <UserList/>
      </MenuGrid>
  );
}

export default Menu;