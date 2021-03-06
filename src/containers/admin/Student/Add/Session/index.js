import { memo, useEffect } from "react"
import _ from "lodash"
import axios from "axios"
import useStateWithLabel from "../../../../../helpers/useStateWithLabel"
import FormError from "../../../../../components/FormError/FormError"
import SessionOptions from "../../../../../components/form/BasicOption/BasicOption"

function AddSession(props) {
  const [session, setSession] = useStateWithLabel(null, "session")
  const [options, setOptions] = useStateWithLabel(null, "session options")
  const [isValid, setIsValid] = useStateWithLabel(true, "isValid")
  const [errorMessage, setErrorMessage] = useStateWithLabel("", "errorMessage")

  const fetchAllSessions = () =>
    axios.get(`/api/admin/sessions`, {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    })

  useEffect(async () => {
    const fetchedOptions = await fetchAllSessions()
    setOptions(fetchedOptions.data)
  }, [])

  useEffect(async () => {
    if (options) {
      if (options.length > 0) {
        setSession(options[0].id)
      }
    }
  }, [options])

  useEffect(() => {
    props.onSessionChildChange({
      value: session && session.toString(),
      isValid,
      errorMessage,
    })
  }, [session])

  const onSessionChange = (e) => {
    setSession(e.target.value)
    setIsValid(true)
    setErrorMessage("")
  }

  return (
    <div className="form-group">
      Niên Khoá
      <select
        value={session ? session.value : ""}
        onChange={onSessionChange}
        className="form-control"
        id="sessionSelectInput"
      >
        {options && (
          <SessionOptions options={options} valueLabel="id" content="name" />
        )}
      </select>
      <FormError isValid={isValid} errorMessage={errorMessage} />
    </div>
  )
}

export default memo(AddSession, (prv, nxt) =>
  _.isEqual(prv.session, nxt.session)
)
