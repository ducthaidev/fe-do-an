import { useState, useEffect, useRef } from "react"
import useAuthRequest from "../../../../helpers/useAuthRequest"

function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object)
  for (const name of propNames) {
    const value = object[name]
    if (value && typeof value === "object") {
      deepFreeze(value)
    }
  }
  return Object.freeze(object)
}

function LecturerEdit() {
  const [departments, setDepartments] = useState(null)
  const [lecturers, setLecturers] = useState(null)
  const [lecturer, setLecturer] = useState(null)
  const [departmentUpdateInput, setDepartmentUpdateInput] = useState(null)

  const departmentInputRef = useRef()
  const lecturerInputRef = useRef()
  const departmentUpdateInputRef = useRef()
  const lecturerUpdateInputRef = useRef()

  const authRequest = useAuthRequest()

  // get
  const getDepartment = () => authRequest.get("/api/departments")
  const getLecturers = (departmentId) =>
    authRequest.get(`/api/admin/lecturers?departmentId=${departmentId}`)
  const getLecturer = (id) => authRequest.get(`/api/admin/lecturers/${id}`)

  // effect
  useEffect(() => {
    getDepartment()
      .then((departmentsData) => {
        setDepartments(deepFreeze(departmentsData.data))
        setDepartmentUpdateInput(departmentInputRef.current.value)
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err))
  }, [])
  useEffect(() => {
    if (departments) {
      getLecturers(departmentInputRef.current.value)
        .then((lecturersData) => {
          setLecturers(deepFreeze(lecturersData.data))
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err))
    }
  }, [departments])
  useEffect(() => {
    if (lecturers && lecturers.length !== 0) {
      getLecturer(lecturerInputRef.current.value)
        .then((lecturerData) => {
          setLecturer(deepFreeze(lecturerData.data))
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err))
    } else {
      setLecturer(null)
    }
  }, [lecturers])
  useEffect(() => {
    if (lecturer) {
      departmentUpdateInputRef.current.value = departmentInputRef.current.value
      lecturerUpdateInputRef.current.value = lecturer.name
    }
  }, [lecturer])

  // change
  const departmentInputChange = () => {
    setDepartmentUpdateInput(departmentInputRef.current.value)
    getLecturers(departmentInputRef.current.value)
      .then((lecturersData) => {
        setLecturers(deepFreeze(lecturersData.data))
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err))
  }
  const lecturerInputChange = () => {
    getLecturer(lecturerInputRef.current.value)
      .then((lecturerData) => {
        setLecturer(deepFreeze(lecturerData.data))
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err))
  }
  const departmentInputUpdateChange = () => {}

  // submit
  const onUpdate = (e) => {
    e.preventDefault()
    authRequest({
      method: "PATCH",
      url: `/api/admin/lecturers/${lecturer.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: lecturerUpdateInputRef.current.value,
        departmentId: departmentUpdateInputRef.current.value,
      },
    })
      .then(() => {
        alert("C???p Nh???t Th??nh C??ng")
        window.location.reload()
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err)
        alert("C???p Nh???t Th???t B???i")
        window.location.reload()
      })
  }

  const departmentOption = (departmentData) =>
    departmentData.map((department) => (
      <option key={department.id} value={department.id}>
        {department.name}
      </option>
    ))
  const lecturersOption = (lecturerData) =>
    lecturerData.map((lecturerElm) => (
      <option key={lecturerElm.id} value={lecturerElm.id}>
        {lecturerElm.name}
      </option>
    ))
  const lecturerChange = (lecturerProps) => (
    <div>
      <i>Id hi???n t???i</i>
      <input
        type="text"
        className="form-control"
        disabled
        value={lecturerProps && lecturerProps.id}
      />
      <i>T??n hi???n t???i</i>
      <input
        type="text"
        className="form-control"
        disabled
        value={lecturerProps && lecturerProps.name}
      />
      <i>Khoa hi???n t???i</i>
      <input
        type="text"
        className="form-control"
        disabled
        value={lecturerProps && lecturerProps.department.name}
      />
      <hr />
      <h4>Thay ?????i:</h4>
      <form onSubmit={onUpdate}>
        <div className="form-group">
          Khoa
          <select
            className="form-control"
            id="departmentUpdateInput"
            defaultValue={departmentUpdateInput && departmentUpdateInput}
            ref={departmentUpdateInputRef}
            onChange={departmentInputUpdateChange}
          >
            {departments && departmentOption(departments)}
          </select>
        </div>
        <div className="form-group">
          T??n Gi???ng Vi??n
          <input
            className="form-control"
            type="text"
            id="lecturerUpdateInput"
            ref={lecturerUpdateInputRef}
            defaultValue={lecturerProps && lecturerProps.name}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          C???p Nh???t
        </button>
      </form>
    </div>
  )
  return (
    <div>
      <h1>S???a Gi???ng Vi??n</h1>
      <form>
        <div className="form-group">
          Khoa
          <select
            className="form-control"
            id="departmentInput"
            ref={departmentInputRef}
            onChange={departmentInputChange}
          >
            {departments && departmentOption(departments)}
          </select>
        </div>
        <div className="form-group">
          T??n Gi???ng Vi??n
          <select
            className="form-control"
            ref={lecturerInputRef}
            onChange={lecturerInputChange}
            id="lecturerInput"
          >
            {lecturers && lecturersOption(lecturers)}
          </select>
        </div>
      </form>
      <hr />
      {lecturer && lecturerChange(lecturer)}
    </div>
  )
}

export default LecturerEdit
