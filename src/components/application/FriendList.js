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
      friends: []
    }
  }

  async componentDidMount() {
    this.setState({user: JSON.parse(localStorage.getItem('user'))}, async function () {
      const response = await api.get('/friends/' + this.state.user.id);
    	this.setState({
      	friends: response.data,
      	friendRequests: []
    	})
    });
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
				  	{this.state.friendRequests.map((potentialFriend, index) => {
				  		return	<div key={index}>
				  							<a className="friend-request-container">
				  								<Button className="friend-request-button">✔</Button>
				  								<Button className="friend-request-button">✘</Button>
		          		      	<div>{potentialFriend.username}</div>
		          		    	</a>
		          		    </div>
				  	})}
		        {this.state.friends.map((friend, index) => {
		          return 	<div key={"nested" + index}>
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