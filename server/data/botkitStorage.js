import { db } from 'luno-core';

export default {
  teams: {
    get: async (id, cb) => {
      let team;
      try {
        team = await db.team.getTeam(id);
      } catch (err) {
        return cb(err);
      }
      return cb(null, team);
    },
    save: async (data, cb) => {
      let team;
      try {
        team = await db.team.updateTeam(data);
      } catch (err) {
        return cb(err);
      }
      return cb(null, team);
    },
    all: async (cb) => {
      let teams;
      try {
        teams = await db.team.getTeams();
      } catch (err) {
        return cb(err);
      }
      return cb(null, teams);
    },
  },
  users: {
    get: async (id, cb) => {
      let user;
      try {
        user = await db.user.getUser(id);
      } catch (err) {
        return cb(err);
      }
      return cb(null, user);
    },
    save: async (data, cb) => {
      let user;
      try {
        user = await db.user.updateUser(data);
      } catch (err) {
        return cb(err);
      }
      return cb(null, user);
    },
    // We should never want to return all the users in the system
    all: (cb) => cb(new Error('Not implemented')),
  },
  channels: {
    get: (_, cb) => cb(new Error('Not implemented')),
    save: (_, cb) => cb(new Error('Not implemented')),
    all: (cb) => cb(new Error('Not implemented')),
  },
};
