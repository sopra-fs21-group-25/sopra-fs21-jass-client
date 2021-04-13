import React, {useEffect, useState} from 'react';

export const Friend = () => {
  const [user, SetUser] = useState(null);
  useEffect(props => {
    SetUser(props.user);
  }, []);

  return (
      /*TODO: design friend entry in friendlist here*/
    <div></div>
  );
}