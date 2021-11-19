const handleTeam = (e) => {
	e.preventDefault();

	$("#teamMessage").animate({ width: 'hide' }, 350);

	if($("#teamName").val() == '' || $("#teamSize").val() == '') {
		handleError("Error! All fields are required");
		return false;
	}

	sendAjax('POST', $("#teamForm").attr("action"), $("#teamForm").serialize(), function() {
		loadTeamsFromServer();
	});

	return false;
};

const TeamForm = (props) => {
	return (
		<form id="teamForm" 
			onSubmit={handleTeam}
			name="teamForm"
			action="/maker"
			method="POST"
			className="teamForm">
			<label htmlFor="name">Team Name: </label>
			<input id="teamName" type="text" name="name" placeholder="Team Name"/>
			<label htmlFor="size">Size: </label>
			<input id="teamSize" type="text" name="size" placeholder="Team Size"/>
			<label htmlFor="leader">Leader Name: </label>
			<input id="teamLeader" type="text" name="leader" placeholder="Team Leader"/>
			<input type="hidden" name="_csrf" value={props.csrf}/>
			<input className="makeTeamSubmit" type="submit" value="Make Team"/>
		</form>
	);
};

const TeamList = function(props) {
	if(props.teams.length === 0) {
		return (
			<div className="teamList">
				<h3 className="emptyTeam">No Teams yet</h3>
			</div>
		);
	}

	const teamNodes = props.teams.map(function(team) {
		return (
			<div key={team._id} className="team">
				<img src="/assets/img/logo.png" alt="TM logo" className="teamFace"/>
				<h3 className="teamName">Name: {team.name} </h3>
				<h3 className="teamSize">size: {team.size} </h3>
				<h3 className="teamLeader">leader: {team.leader} </h3>
			</div>
		);
	});

	return (
		<div className="teamList">
			{teamNodes}
		</div>
	);
};

const loadTeamsFromServer = () => {
	sendAjax('GET', '/getTeams', null, (data) => {
		ReactDOM.render(
			<TeamList teams={data.teams} />, document.querySelector("#teams")
		);
	});
};

const setup = function(csrf) {
	ReactDOM.render(
		<TeamForm csrf={csrf} />, document.querySelector("#makeTeam")
	);

	ReactDOM.render(
		<TeamForm teams={[]} />, document.querySelector("#teams")
	);

	loadTeamsFromServer();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});