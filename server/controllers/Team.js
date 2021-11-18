const models = require('../models');

const { Team } = models;

const makerPage = (req, res) => {
  Team.TeamModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), teams: docs });
  });
};

const makeTeam = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const teamData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newTeam = new Team.TeamModel(teamData);

  const teamPromise = newTeam.save();

  teamPromise.then(() => res.json({ redirect: '/maker' }));

  teamPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Team already exists' });
    }

    return res.status(400).json({ error: 'An error has occurred' });
  });

  return teamPromise;
};

const getTeams = (request, response) => {
  const req = request;
  const res = response;

  return Team.TeamModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occurred' });
    }

    return res.json({ teams: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getTeams = getTeams;
module.exports.make = makeTeam;
