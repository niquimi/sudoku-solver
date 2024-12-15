const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
      .end((err, res) => {
        assert.property(res.body, 'solution');
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.propertyVal(res.body, 'error', 'Required field missing');
        done();
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: '1.5..2.84..63.12.7.X..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.propertyVal(res.body, 'error', 'Invalid characters in puzzle');
        done();
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: '1.5..2.84..63.12.7.' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: '9.9..2.84..63.12.7.2..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.propertyVal(res.body, 'error', 'Puzzle cannot be solved');
        done();
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.', coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.propertyVal(res.body, 'valid', true);
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'B5',
        value: '8'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.propertyVal(res.body, 'valid', false);
        assert.deepEqual(res.body.conflict, ['row']);
        done();
      });
  });
  
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.',
        coordinate: 'A2',
        value: '5'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.propertyVal(res.body, 'valid', false);
        assert.deepEqual(res.body.conflict, ['row', 'region']);
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.8339.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'D2',
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.propertyVal(res.body, 'valid', false);
        assert.deepEqual(res.body.conflict, ['row','column', 'region']);
        done();
      });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3..8..6.....5..2.91.43...7.9..6.1.3.',
        coordinate: 'D2'
      })
      .end((err, res) => {
        assert.deepEqual(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.d674.3..8..6.....5..2.91.43...7.9..6.1.3.',
        coordinate: 'D2',
        value: "3"
      })
      .end((err, res) => {
        assert.deepEqual(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.36774.3..8..6.....5..2.91.43...7.9..6.1.3.',
        coordinate: 'D2',
        value: "3"
      })
      .end((err, res) => {
        assert.deepEqual(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'L12',
        value: "4"
      })
      .end((err, res) => {
        assert.deepEqual(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'D2',
        value: "21"
      })
      .end((err, res) => {
        assert.deepEqual(res.body.error, 'Invalid value');
        done();
      });
  });
  
});
