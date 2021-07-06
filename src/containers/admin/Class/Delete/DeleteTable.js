import {
  Add,
  ArrowUpward,
  Cancel,
  Check,
  Clear,
  Delete,
  Edit as EditIcon,
  FilterList,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
  Replay,
  Search,
} from "@material-ui/icons"
import { memo } from "react"
import MaterialTable from "material-table"
// import _ from "lodash"
import useAuthRequest from "../../../../helpers/useAuthRequest"

function DeleteTable(props) {
  const icons = {
    Delete,
    Add,
    Check,
    Cancel,
    Clear,
    Edit: EditIcon,
    Search,
    ResetSearch: Clear,
    FirstPage,
    LastPage,
    NextPage: NavigateNext,
    PreviousPage: NavigateBefore,
    Filter: FilterList,
    Retry: Replay,
    SortArrow: ArrowUpward,
  }

  // eslint-disable-next-line no-unused-vars
  const departmentsLookup = props.departments.reduce(
    (acc, crv) => ({ ...acc, [crv.id]: crv.name }),
    {}
  )
  const sessionsLookup = props.sessions.reduce(
    (acc, crv) => ({ ...acc, [crv.id]: crv.name }),
    {}
  )
  // must use with static because state cause memory leak
  const staticColumns = [
    { title: "Tên Lớp", field: "name" },
    {
      title: "Thuộc Khoa",
      field: "department.id",
      lookup: departmentsLookup,
    },
    {
      title: "Khoá",
      field: "session.id",
      lookup: sessionsLookup,
    },
  ]
  const localization = {
    header: {
      actions: "",
    },
    toolbar: {
      searchPlaceholder: "Tìm Kiếm",
    },
    pagination: {
      labelRowsSelect: "Dòng",
      labelDisplayedRows: "{from}-{to} của {count}",
    },
    body: {
      emptyDataSourceMessage: "Không Tồn Tại Bản Ghi Nào",
      editRow: {
        deleteText: `Bạn có muốn xoá sinh viên này?`,
      },
    },
  }
  const title = `Danh Sách Lớp`
  const authRequest = useAuthRequest()
  const { classes, setClasses } = props
  return (
    <MaterialTable
      icons={icons}
      title={title}
      columns={staticColumns}
      data={classes}
      localization={localization}
      editable={{
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            authRequest({
              method: "DELETE",
              url: `/api/admin/classes/${oldData.id}`,
            })
              .then((updatedClass) => {
                window.alert("Cập Nhật Thành Công")
                // eslint-disable-next-line no-console
                console.log(updatedClass)
                const dataDelete = [...classes]
                const index = oldData.tableData.id
                dataDelete.splice(index, 1)
                setClasses([...dataDelete])
                resolve()
              })
              .catch((error) => {
                window.alert("Cập Nhật Thất Bại")
                // eslint-disable-next-line no-console
                console.log(error)
                reject()
              })
          }),
      }}
    />
  )
}

function propsAreEqual(prv, nxt) {
  return _.isEqual(prv.classes, nxt.classes)
}

export default memo(DeleteTable, propsAreEqual)
