const userTests = [
	{ id: "12345", username: "admin", password: "1234", admin: "true" },
	{ id: "74568", username: "user", password: "newTest" },
];

module.exports = {
	findUserById: function (id) {
		return userTests.find(u => u.id === id);
	},
	userByIdExists: function (id) {
		return this.findUserById(id) != null;
	},
	findUserByCredentials: function (username, password) {
		return userTests.find(u => u.username === username && u.password === u.password);
	}
}