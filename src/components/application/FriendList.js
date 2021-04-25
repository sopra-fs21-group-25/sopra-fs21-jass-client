import React from 'react';
import styled from 'styled-components';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import './css/friendlist.css';

class FriendList extends React.Component {
  constructor() {
    super();
    this.state = {
    	user: null,
      friendRequests: [],
      friends: [{}]
    }
  }
  async componentDidMount() {
    this.setState({user: JSON.parse(localStorage.getItem('user'))}, async function () {
      const friends = await api.get('/friends/' + this.state.user.id);
    	this.setState({
      	friends: friends.data
    	});
      await this.getCurrentFriendRequestList()
    });
  }

  async getCurrentFriendRequestList(){
    const response = await api.get('/friend_requests/' + this.state.user.id);
    this.fillFriendRequestList(response.data);
    this.startEventSource(this.state.user.id); 
  }
  
  async fillFriendRequestList(data){
    console.log("fillFriendRequestList: " + data); 
    var friend_requests = new Array();
    const len = data.length;
    for (var i = 0; i < len; i++) {
      friend_requests[i] = new Array();
      var current_request = data.pop();
      const response = await api.get('/users/' + current_request.fromId);
      friend_requests[i] = {'id': current_request.id, 'from': response.data};
    }
    this.setState({
      friendRequests: friend_requests
    });
  }
  startEventSource(user_id) {
    this.eventSource = new EventSource(`http://localhost:8080/friend_requests/event/` + user_id);
    this.eventSource.addEventListener('error', (e) => {
      console.log("An error occurred while attempting to connect.");
    }); 
    this.eventSource.onmessage = e =>
      this.fillFriendRequestList(JSON.parse(e.data));
  }

  async acceptFriendRequest(id) {
    const response = await api.post('/friend_requests/accept/' + id);
    window.location.reload();
    return false;
  }

  async declineFriendRequest(id) {
    const response = await api.delete('/friend_requests/decline/' + id);
    window.location.reload();
    return false;
  }

  activateDropdown() {
    var elem = document.getElementById("dropdownList");
    if (typeof elem !== 'undefined' && elem !== null) {
      elem.classList.toggle("show");
    }
  }

  filterSearch() {
    var input = document.getElementById("search");
    var filter = input.value.toUpperCase();
    var a = document.querySelectorAll('[title="friend"]');
    for (var i = 0; i < a.length; i++) {
      var txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  render() {
    return (
      <div className="friends-container">
		    <div className="dropdown">
			  <button onClick={this.activateDropdown} className="dropbtn">Friends <span style={{float: "right"}}>▼</span></button>
			  <div id="dropdownList" className="dropdown-content">
			  	<input type="text" placeholder="Search.." id="search" onKeyUp={this.filterSearch}></input>
				  	{this.state.friendRequests.map((request, index) => {
				  		return	<div key={"request" + index}>
				  							<a className="friend-request-container">
				  								<Button className="friend-request-button" onClick={() => this.acceptFriendRequest(request.id)}>✔</Button>
				  								<Button className="friend-request-button" onClick={() => this.declineFriendRequest(request.id)}>✘</Button>
		          		      	<div>{request.from.username}</div>
		          		    	</a>
		          		    </div>
				  	})}
		        {this.state.friends.map((friend, index) => {
		          return 	<div key={"friend" + index}>
		                   	<ContextMenuTrigger id={"nested" + index.toString()}>
		                     	<a title="friend">
		          	          	{friend.status == 'ONLINE' && <div className='circle-green float-child-1'></div>}
		          	          	{friend.status == 'OFFLINE' && <div className='circle-red float-child-1'></div>}
		          		       		<div>{friend.username}</div>
		          		    		</a>
		          		   		</ContextMenuTrigger>
		          		   		<ContextMenu id={"nested" + index.toString()}>
						     					<MenuItem>
				              			<span>Send a message</span>
				            			</MenuItem>
						            	<MenuItem>
						              	<span>Invite to the game</span>
						            	</MenuItem>
                          <MenuItem>
                            <span>Remove from friends</span>
                          </MenuItem>
						          	</ContextMenu>
				        			</div>
		        })}
			  </div>
			</div>
	  </div>
    );
  }
}

export default FriendList;