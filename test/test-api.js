const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const Pet = require('../models/pet');

const fido =     {
    "name": "Norman",
    "species": "Greyhound",
    "birthday": "2008-11-11",
    "favoriteFood": "Liver",
    "price": 10,
    "avatarUrl": "http://www.gpamass.com/s/img/emotionheader713297504.jpg",
    "picUrl": "http://www.gpamass.com/s/img/emotionheader713297504.jpg",
    "picUrlSq": "https://www.collinsdictionary.com/images/thumb/greyhound_21701074_250.jpg",
    "description": "Fido is a dog and he's a good dog who loves to play and hang out with his owners. He also likes to nap and enjoys eating dog food"
};

chai.use(chaiHttp);

describe('Pets', ()  => {

  after(async () => { 
    await Pet.deleteMany({name: 'Norman'});
  });
  
  // TEST CREATE 
  it('should create a SINGLE pet on /api/pets POST', (done) => {
    chai.request(server)
        .post('/api/pets')
        .send(fido)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json
          done();
        });
  });

  // TEST SHOW
  it('should show a SINGLE pet on /api/pets/<id> GET', (done) => {
    var pet = new Pet(fido);
     pet.save((err, data) => {
       chai.request(server)
         .get(`/api/pets/${data._id}`)
         .end((err, res) => {
           res.should.have.status(200);
           res.should.be.json
           done();
         });
     });

  });

  // TEST UPDATE
  it('should update a SINGLE pet on /api/pets/<id> PUT', (done) => {
    var pet = new Pet(fido);
    pet.save((err, data)  => {
     chai.request(server)
      .put(`/api/pets/${data._id}`)
      .send({'name': 'Spider'})
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json
        done();
      });
    });
  });

  // TEST DELETE
  it('should delete a SINGLE pet on /api/pets/<id> DELETE', (done) => {
    var pet = new Pet(fido);
    pet.save((err, data)  => {
     chai.request(server)
      .delete(`/api/pets/${data._id}  `)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json
        done();
      });
    });
  });

});