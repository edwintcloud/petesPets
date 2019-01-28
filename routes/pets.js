const Pet = require("../models/pet");
const multer = require("multer");
const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const googleCloudStorage = new Storage({
  projectId: "petespets",
  keyFilename: "storage_key.json"
});

// Multer is required to process file uploads and make them available via
// req.files.
const m = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

// A bucket is a container for objects (files).
const bucket = googleCloudStorage.bucket("petespets-bucket");

// PET ROUTES
module.exports = app => {
  // INDEX PET => index.js

  // NEW PET
  app.get("/pets/new", (req, res) => {
    res.render("pets-new");
  });

  // CREATE PET
  app.post("/pets", m.single("avatar"), (req, res, next) => {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);

    // Make sure to set the contentType metadata for the browser to be able
    // to render the image instead of downloading the file (default behavior)
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    blobStream.on("error", err => {
      next(err);
      return;
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${
        blob.name
      }`;

      // Make the image public to the web (since we'll be displaying it in browser)
      blob.makePublic().then(() => {
        req.body.avatarUrl = publicUrl;
        var pet = new Pet(req.body);

        pet
          .save()
          .then(pet => {
            res.send({ pet: pet });
          })
          .catch(err => {
            // STATUS OF 400 FOR VALIDATIONS
            res.status(400).send(err.errors);
          });
      });
    });

    blobStream.end(req.file.buffer);
  });

  // SHOW PET
  app.get("/pets/:id", (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render("pets-show", { pet: pet });
    });
  });

  // EDIT PET
  app.get("/pets/:id/edit", (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render("pets-edit", { pet: pet });
    });
  });

  // UPDATE PET
  app.put("/pets/:id", (req, res) => {
    Pet.findByIdAndUpdate(req.params.id, req.body)
      .then(pet => {
        res.redirect(`/pets/${pet._id}`);
      })
      .catch(err => {
        // Handle Errors
      });
  });

  // DELETE PET
  app.delete("/pets/:id", (req, res) => {
    Pet.findByIdAndRemove(req.params.id).exec((err, pet) => {
      return res.redirect("/");
    });
  });

  // SEARCH PET
  app.get("/search", (req, res) => {
    const term = new RegExp(req.query.term, "i");
    const page = req.query.page || 1;
    Pet.paginate(
      {
        $or: [{ name: term }, { species: term }]
      },
      { page: page }
    ).then(results => {
      res.render("pets-index", {
        pets: results.docs,
        pagesCount: results.pages,
        currentPage: page,
        term: req.query.term
      });
    });
  });
};
