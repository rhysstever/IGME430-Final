"use strict";

var handleTeam = function handleTeam(e) {
  e.preventDefault();
  $("#teamMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#teamName").val() == '' || $("#teamAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#teamForm").attr("action"), $("#teamForm").serialize(), function () {
    loadTeamsFromServer();
  });
  return false;
};

var TeamForm = function TeamForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "teamForm",
    onSubmit: handleTeam,
    name: "teamForm",
    action: "/maker",
    method: "POST",
    className: "teamForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "teamName",
    type: "text",
    name: "name",
    placeholder: "Team Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "teamAge",
    type: "text",
    name: "age",
    placeholder: "Team Age"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeTeamSubmit",
    type: "submit",
    value: "Make Team"
  }));
};

var TeamList = function TeamList(props) {
  if (props.teams.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "teamList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyTeam"
    }, "No Teams yet"));
  }

  var teamNodes = props.teams.map(function (team) {
    return /*#__PURE__*/React.createElement("div", {
      key: team._id,
      className: "team"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "team face",
      className: "teamFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "teamName"
    }, "Name: ", team.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "teamAge"
    }, "Age: ", team.age, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "teamList"
  }, teamNodes);
};

var loadTeamsFromServer = function loadTeamsFromServer() {
  sendAjax('GET', '/getTeams', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(TeamList, {
      teams: data.teams
    }), document.querySelector("#teams"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(TeamForm, {
    csrf: csrf
  }), document.querySelector("#makeTeam"));
  ReactDOM.render( /*#__PURE__*/React.createElement(TeamForm, {
    teams: []
  }), document.querySelector("#teams"));
  loadTeamsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#teamMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#teamMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
