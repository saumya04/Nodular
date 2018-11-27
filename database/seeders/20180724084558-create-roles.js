'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		  Add altering commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.bulkInsert('Person', [{
			name: 'John Doe',
			isBetaMember: false
		  }], {});
		*/
		return queryInterface.bulkInsert('roles', [
			{
				name: 'admin',
				display_name: 'Admin',
				description: 'This role denotes the user as Admin/Manager',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: 'student',
				display_name: 'Student',
				description: 'This role denotes the user as Student',
				created_at: new Date(),
				updated_at: new Date(),
			},
		], {});
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.bulkDelete('Person', null, {});
		*/
	}
};
