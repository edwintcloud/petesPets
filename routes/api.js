const Pet = require("../models/pet");

module.exports = app => {
  
  // show - GET - /api/pets/:id
  app.get("/api/pets/:id", (req, res) => {
    Pet.findById(req.params.id)
      .then(pet => {
        res.json(pet);
      })
      .catch(err => {
        res.json({
          error: err
        });
      });
  });

  // create - POST - /api/pets
  app.post("/api/pets", (req, res) => {
    Pet.create(req.body)
      .then(pet => {
        res.json(pet);
      })
      .catch(err => {
        res.json({
          error: err
        });
      });
  });

  // update - PUT - /api/pets/:id
  app.put("/api/pets/:id", (req, res) => {
    Pet.findByIdAndUpdate(req.params.id, req.body)
      .then(pet => {
        res.json(pet);
      })
      .catch(err => {
        res.json({
          error: err
        });
      });
  });

  // delete - DELETE - /api/pets/:id
  app.delete("/api/pets/:id", (req, res) => {
    Pet.findByIdAndDelete(req.params.id)
      .then(pet => {
        res.json({
          status: "OK"
        });
      })
      .catch(err => {
        res.json({
          error: err
        });
      });
  });
};
