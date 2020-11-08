const postResolvers = require('./posts');
const userResolvers = require('./users')
const recoResolvers = require('./recommend')
const profileResolvers = require('./profile')
const requestResolvers = require('./friendreq')
const subResolvers = require('./sub')
const meetrequestResolvers = require('./meetreq')
const notifResolvers = require('./notif')

module.exports = {
	Query: {
		...postResolvers.Query,
		...recoResolvers.recommend,
		...profileResolvers.profile,
		...notifResolvers.Query
	},
	Mutation: {
		...userResolvers.Mutation,
		...postResolvers.Mutation,
		...requestResolvers.frenrequest,
		...requestResolvers.frenaccept,
		...requestResolvers.frenreject,
		...subResolvers.subsave,
		...meetrequestResolvers.meetrequest,
		...meetrequestResolvers.meetaccept,
		...meetrequestResolvers.meetreject
	}
}
