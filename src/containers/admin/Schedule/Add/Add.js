import { useEffect } from "react"
import useStateWithLabel from "../../../../helpers/useStateWithLabel"
import BasicOption from "../../../../components/form/BasicOption/BasicOption"
import useAuthRequest from "../../../../helpers/useAuthRequest"

function ScheduleAdd() {
  const [departments, setDepartments] = useStateWithLabel(null, "departments")
  const [subjects, setSubjects] = useStateWithLabel(null, "subjects")
  const [lecturers, setLecturers] = useStateWithLabel(null, "lecturers")
  const [sessions, setSessions] = useStateWithLabel(null, "sessions")
  const [classes, setClasses] = useStateWithLabel(null, "classes")
  const [semesters, setSemesters] = useStateWithLabel(null, "semesters")
  const [lectureHalls, setLectureHalls] = useStateWithLabel(
    null,
    "lectureHalls"
  )
  const [classrooms, setClassrooms] = useStateWithLabel(null, "classrooms")
  const [departmentInput, setDepartmentInput] = useStateWithLabel(
    "",
    "departmentInput"
  )
  const [subjectTypeInput, setSubjectTypeInput] = useStateWithLabel(
    "0",
    "subjectTypeInput"
  )
  const [subjectNameInput, setSubjectNameInput] = useStateWithLabel(
    "",
    "subjectNameInput"
  )
  const [lecturerInput, setLecturerInput] = useStateWithLabel(
    "",
    "lecturerInput"
  )
  const [sessionInput, setSessionInput] = useStateWithLabel("", "sessionInput")
  const [classInput, setClassInput] = useStateWithLabel("", "classInput")
  const [semesterInput, setSemesterInput] = useStateWithLabel(
    "",
    "sessionInput"
  )
  const [startPeriodInput, setStartPeriodInput] = useStateWithLabel(
    "1",
    "startPeriodInput"
  )
  const [endPeriodInput, setEndPeriodInput] = useStateWithLabel(
    "1",
    "endPeriodInput"
  )
  const [weekDayInput, setWeekDayInput] = useStateWithLabel("2", "weekDayInput")
  const [startDayInput, setStartDayInput] = useStateWithLabel(
    "",
    "startDayInput"
  )
  const [endDayInput, setEndDayInput] = useStateWithLabel("", "endDayInput")
  const [periodTypeInput, setPeriodTypeInput] = useStateWithLabel(
    "0",
    "periodTypeInput"
  )
  const [lectureHallInput, setLectureHallInput] = useStateWithLabel(
    "",
    "lectureHallInput"
  )
  const [classroomInput, setClassroomInput] = useStateWithLabel(
    "",
    "classroomInput"
  )
  const authRequest = useAuthRequest()

  const getAllDepartments = () => authRequest.get(`/api/departments`)
  const getSubjectsWithTypeAndDepartment = (subjectType, departmentId) =>
    authRequest.get(
      `/api/admin/subjects?subjectType=${subjectType}&departmentId=${departmentId}`
    )
  const getLecturersWithDepartment = (departmentId) =>
    authRequest.get(`/api/admin/lecturers?departmentId=${departmentId}`)
  const getAllSessions = () => authRequest.get(`/api/admin/sessions`)
  const getSemestersWithSession = (sessionId) =>
    authRequest.get(`/api/semesters?sessionId=${sessionId}`)
  const getClassesWithDepartmentAndSession = (departmentId, sessionId) =>
    authRequest.get(
      `/api/classes?departmentId=${departmentId}&sessionId=${sessionId}`
    )
  const getAllLectureHalls = () => authRequest.get(`/api/lecturerHalls`)
  const getClassroomsWithLecturerHalls = (lectureHallId) =>
    authRequest.get(`/api/admin/classrooms?lectureHallId=${lectureHallId}`)

  useEffect(async () => {
    try {
      const departmentsData = await getAllDepartments()
      const sessionsData = await getAllSessions()
      const lectureHallsData = await getAllLectureHalls()

      setDepartments(departmentsData.data)
      setSessions(sessionsData.data)
      setLectureHalls(lectureHallsData.data)

      if (departmentsData.data.length > 0) {
        setDepartmentInput(departmentsData.data[0].id.toString())
      }
      if (sessionsData.data.length > 0) {
        setSessionInput(sessionsData.data[0].id.toString())
      }
      if (lectureHallsData.data.length > 0) {
        setLectureHallInput(lectureHallsData.data[0].id.toString())
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }, [])
  useEffect(async () => {
    if (departmentInput.length > 0 && subjectTypeInput.length > 0) {
      const subjectsData = await getSubjectsWithTypeAndDepartment(
        subjectTypeInput,
        departmentInput
      )
      setSubjects(subjectsData.data)
      if (subjectsData.data.length > 0) {
        setSubjectNameInput(subjectsData.data[0].id.toString())
      }
    }
  }, [departmentInput, subjectTypeInput])
  useEffect(async () => {
    if (departmentInput.length > 0) {
      const lecturersData = await getLecturersWithDepartment(departmentInput)
      setLecturers(lecturersData.data)
      if (lecturersData.data.length > 0) {
        setLecturerInput(lecturersData.data[0].id)
      }
    }
  }, [departmentInput])
  useEffect(async () => {
    if (sessionInput.length > 0) {
      const semestersData = await getSemestersWithSession(sessionInput)
      setSemesters(semestersData.data)
      if (semestersData.data.length > 0) {
        setSemesterInput(semestersData.data[0].id.toString())
      }
    }
  }, [sessionInput])
  useEffect(async () => {
    if (sessionInput.length > 0 && departmentInput.length > 0) {
      const classesData = await getClassesWithDepartmentAndSession(
        departmentInput,
        sessionInput
      )
      setClasses(classesData.data)
      if (classesData.data.length > 0) {
        setClassInput(classesData.data[0].id.toString())
      }
    }
  }, [sessionInput, departmentInput])
  useEffect(async () => {
    if (lectureHallInput.length > 0) {
      const classroomsData = await getClassroomsWithLecturerHalls(
        lectureHallInput
      )
      setClassrooms(classroomsData.data)
      if (classroomsData.data.length > 0) {
        setClassroomInput(classroomsData.data[0].id)
      }
    }
  }, [lectureHallInput])

  const onDepartmentInputChange = (e) => {
    setDepartmentInput(e.target.value)
  }
  const onSubjectTypeInputChange = (e) => {
    setSubjectTypeInput(e.target.value)
  }
  const onSubjectNameInputChange = (e) => {
    setSubjectNameInput(e.target.value)
  }
  const onLecturerInputChange = (e) => {
    setLecturerInput(e.target.value)
  }
  const onSessionInputChange = (e) => {
    setSessionInput(e.target.value)
  }
  const onClassInputChange = (e) => {
    setClassInput(e.target.value)
  }
  const onSemesterInputChange = (e) => {
    setSemesterInput(e.target.value)
  }
  const onStartPeriodInputChange = (e) => {
    setStartPeriodInput(e.target.value)
  }
  const onEndPeriodInputChange = (e) => {
    setEndPeriodInput(e.target.value)
  }
  const onWeekDayInputChange = (e) => {
    setWeekDayInput(e.target.value)
  }
  const onStartDayInputChange = (e) => {
    setStartDayInput(e.target.value)
  }
  const onEndDayInputChange = (e) => {
    setEndDayInput(e.target.value)
  }
  const onPeriodTypeInputChange = (e) => {
    setPeriodTypeInput(e.target.value)
  }
  const onLectureHallInputChange = (e) => {
    setLectureHallInput(e.target.value)
  }
  const onClassroomInputChange = (e) => {
    setClassroomInput(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await authRequest({
        method: "POST",
        url: `/api/admin/schedules`,
        data: {
          subjectType: parseInt(subjectTypeInput, 10),
          subject: parseInt(subjectNameInput, 10),
          department: parseInt(departmentInput, 10),
          lecturer: parseInt(lecturerInput, 10),
          session: parseInt(sessionInput, 10),
          classId: parseInt(classInput, 10),
          semester: parseInt(semesterInput, 10),
          startPeriod: parseInt(startPeriodInput, 10),
          endPeriod: parseInt(endPeriodInput, 10),
          startDay: startDayInput,
          endDay: endDayInput,
          periodType: parseInt(periodTypeInput, 10),
          classroomId: parseInt(classroomInput, 10),
          week: parseInt(weekDayInput, 10),
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.data.message) {
        window.alert(`Th??m Th???i Kho?? Bi???u Th???t B???i. ${response.data.message}`)
      } else {
        window.alert("Th??m Th???i Kho?? Bi???u Th??nh C??ng!")
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
      window.alert(`Th??m Th???i Kho?? Bi???u Th???t B???i!`)
    }
  }
  return (
    <>
      <h1>Th??m Th???i Kh??a Bi???u</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          Khoa
          <div>
            <select
              className="form-control"
              id="departmentInput"
              value={departmentInput}
              onChange={onDepartmentInputChange}
            >
              {departments && (
                <BasicOption
                  keyLabel="id"
                  valueLabel="id"
                  options={departments}
                  content="name"
                />
              )}
            </select>
          </div>
        </div>
        <div className="form-group">
          Ki???u M??n
          <select
            className="form-control"
            id="subjectTypeInput"
            value={subjectTypeInput}
            onChange={onSubjectTypeInputChange}
          >
            <option value="0">l?? thuy???t</option>
            <option value="1">th???c h??nh</option>
          </select>
        </div>
        <div className="form-group">
          T??n M??n
          <select
            className="form-control"
            id="subjectInput"
            value={subjectNameInput}
            onChange={onSubjectNameInputChange}
          >
            {subjects && (
              <BasicOption options={subjects} valueLabel="id" content="name" />
            )}
          </select>
        </div>
        <div className="form-group">
          Gi???ng Vi??n
          <div>
            <select
              className="form-control"
              id="lecturerInput"
              value={lecturerInput}
              onChange={onLecturerInputChange}
            >
              {lecturers && (
                <BasicOption
                  options={lecturers}
                  valueLabel="id"
                  content="name"
                />
              )}
            </select>
          </div>
        </div>
        <div className="form-group">
          Kho??
          <select
            className="form-control"
            id="sessionInput"
            value={sessionInput}
            onChange={onSessionInputChange}
          >
            {sessions && (
              <BasicOption options={sessions} valueLabel="id" content="name" />
            )}
          </select>
        </div>
        <div className="form-group">
          L???p
          <select
            className="form-control"
            id="classInput"
            value={classInput}
            onChange={onClassInputChange}
          >
            {classes && (
              <BasicOption options={classes} valueLabel="id" content="name" />
            )}
          </select>
        </div>
        <div className="form-group">
          H???c K???
          <select
            className="form-control"
            id="semesterInput"
            value={semesterInput}
            onChange={onSemesterInputChange}
          >
            {semesters && (
              <BasicOption
                options={semesters}
                valueLabel="id"
                content="termNumber"
              />
            )}
          </select>
        </div>
        <div className="form-group">
          Ti???t B???t ?????u
          <select
            className="form-control"
            id="startPeriodInput"
            value={startPeriodInput}
            onChange={onStartPeriodInputChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <div className="form-group">
          Ti???t K???t Th??c
          <select
            className="form-control"
            id="endPeriodInput"
            value={endPeriodInput}
            onChange={onEndPeriodInputChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <div className="form-group">
          Th???
          <select
            className="form-control"
            id="weekDayInput"
            value={weekDayInput}
            onChange={onWeekDayInputChange}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
        <div className="form-group">
          Ng??y B???t ?????u
          <input
            className="form-control"
            type="date"
            value={startDayInput}
            onChange={onStartDayInputChange}
            id="startDayInput"
          />
        </div>
        <div className="form-group">
          Ng??y K???t Th??c
          <input
            className="form-control"
            type="date"
            value={endDayInput}
            onChange={onEndDayInputChange}
            id="endDayInput"
          />
        </div>
        <div className="form-group">
          Bu???i
          <select
            className="form-control"
            id="periodType"
            value={periodTypeInput}
            onChange={onPeriodTypeInputChange}
          >
            <option value="0">S??ng</option>
            <option value="1">Chi???u</option>
            <option value="2">T???i</option>
          </select>
        </div>
        <div className="form-group">
          Ch???n Gi???ng ???????ng
          <select
            className="form-control"
            id="lectureHall"
            value={lectureHallInput}
            onChange={onLectureHallInputChange}
          >
            {lectureHalls && (
              <BasicOption
                options={lectureHalls}
                valueLabel="id"
                content="name"
              />
            )}
          </select>
        </div>
        <div className="form-group">
          Ch???n Ph??ng H???c
          <select
            className="form-control"
            id="classroom"
            value={classroomInput}
            onChange={onClassroomInputChange}
          >
            {classrooms && (
              <BasicOption
                options={classrooms}
                valueLabel="id"
                content="name"
              />
            )}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Th??m
        </button>
      </form>
    </>
  )
}

export default ScheduleAdd
