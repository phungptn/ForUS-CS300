export default function Admin() {
  return (
    <div>
        <div>
                  <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingInput"
          placeholder="box"
        //   onChange={(event) => }
        />
        <label htmlFor="floatingInput">Box: Giải trí</label>
      </div>

      <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            // onClick={(event) => Login(event)}
          >
            Create Box
          </button>
        </div>

        <div>
        <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingInput"
          placeholder="group"
        //   onChange={(event) => }
        />
        <label htmlFor="floatingInput">Group: Giải trí</label>
      </div>

      <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            // onClick={(event) => Login(event)}
          >
            Create Group
          </button>
        </div>

    </div>
  );
}
