const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Mentor = require('../models/Mentor');
const id = '5ff9a1e8fb71aa0004c5aa3e'

const mentor1 = {
        firstName: 'Luigi',
        lastName:'Test',
        title: 'Dev front',
        disponible: 'Oui',
        presentation: 'Hello je suis Mans',
        technos: ["Python","Zend","Swift","Test"]
}

beforeEach(async () => {
    await Mentor.deleteMany({})
    //await Mentor(mentor1).save()
});


afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
  })



  test('should get Mentor', async () => {
    const mentor = await Mentor.create( {
        firstName: 'Peach',
        lastName:'Test',
        title: 'Dev front',
        disponible: 'Oui',
        presentation: 'Hello je suis Mans',
        technos: '["Python","Zend","Swift","Test"]',
        socials: '[{"web":"","linkedin":"","discord":"","twitter":"","github":""}]'
})
    await request(app).get('/api/mentors')
    .expect(200)
    .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy()

        // Check the response data
        expect(response.body[0]._id).toBe(mentor.id)
        expect(response.body[0].firstName).toBe(mentor.firstName)
        expect(response.body[0].lastName).toBe(mentor.lastName)
    })
});

test('should get One Mentor', async () => {
	const mentor = await Mentor.create( {
        firstName: 'Mario',
        lastName:'Test',
        title: 'Dev front',
        disponible: 'Oui',
        presentation: 'Hello je suis Mans',
        technos: '["Python","Zend","Swift","Test"]',
        socials: '[{"web":"","linkedin":"","discord":"","twitter":"","github":""}]'
})

	await request(app)
		.get("/api/mentor/" + mentor.id)
		.expect(200)
		.then((response) => {
			expect(response.body._id).toBe(mentor.id)
			expect(response.body.firstName).toBe(mentor.firstName)
			expect(response.body.lastName).toBe(mentor.lastName)
		})
})

test("should delete one Mentor", async () => {
	const mentor = await Mentor.create( {
        firstName: 'Todd',
        lastName:'Test',
        title: 'Dev front',
        disponible: 'Oui',
        presentation: 'Hello je suis Mans',
        technos: '["Python","Zend","Swift","Test"]',
        socials: '[{"web":"","linkedin":"","discord":"","twitter":"","github":""}]'
})

	await request(app)
		.delete("/api/mentors/" + mentor.id)
		.expect(204)
		.then(async () => {
			expect(await Mentor.findOne({ _id: mentor.id })).toBeFalsy()
		})
})

test("Should post Mentor", async () => {
	const data = await Mentor.create( {
        firstName: 'Todd',
        lastName:'Test',
        avatar: 'https://images.unsplash.com/photo-1495681796091-d84e65e2ad51?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=3341&q=80',
        title: 'Dev front',
        disponible: 'Oui',
        presentation: 'Hello je suis Mans',
        technos: '["Python","Zend","Swift","Test"]',
        socials: '[{"web":"","linkedin":"","discord":"","twitter":"","github":""}]'
})

	 request(app)
        .post("/api/mentors")
        .attach('file', '../uploads/sonia-nadales-QEfeSgbM2ds-unsplash.jpg')
        .field('firstName' , data.firstName)
        .field('lastName' , data.lastName)
        .field('title' , data.title)
        .field('avatar' , data.avatar )
        .field('disponible' , data.disponible)
        .field('presentation' , data.presentation)
        .field('technos' , data.technos)
        .field('socials' , data.socials)
        .expect(201)
        .end((err) => {
          console.log(err)
        });
		
})

