import "./App.scss";
import { useState, useEffect } from "react";

import { useToast } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

function App() {
  const [todo, setTodo] = useState([]);
  const [data, setData] = useState({ data: "", state: undefined });
  const [completed, setCompleted] = useState(2);
  const toast = useToast();

  useEffect(() => {
    async function getItemFromLocalStorage() {
      setTodo(
        localStorage.getItem("Todo")
          ? JSON.parse(localStorage.getItem("Todo"))
          : []
      );
    }
    getItemFromLocalStorage();
  }, []);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const Toast = (title, des, status) => {
    console.log(title, des, status);
    toast({
      title: title,
      description: des,
      status: status,
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  function handleAdd(event) {
    event.preventDefault();
    if (todo.length < 6) {
      if (data.data.length > 0) {
        setTodo([...todo, data]);
        setData({ data: "", state: undefined });
        localStorage.setItem("Todo", JSON.stringify([...todo, data]));

        Toast(`Created - ${data.data}`, "", "success");
      } else {
        Toast("Please Enter Something . . .", "", "warning");
      }
    } else {
      Toast("You Can't make More Than 5 todo", "", "info");
    }
  }

  const Item = ({ index, d }) => {
    return (
      <>
        <div className="Items" key={index}>
          <div
            className={
              d.state === 0
                ? "Title"
                : d.state === 1
                ? "Title Completed"
                : "Title"
            }
            onClick={() => {
              if (todo[index].state === 0) {
                let data = todo;
                data[index].state = 1;
                setTodo([...data]);
                localStorage.setItem("Todo", JSON.stringify(data));
              }
              return 1;
            }}
          >
            {d.data}
          </div>
          <button
            onClick={() => {
              if (todo[index].state === 0) {
                if (window.confirm("This Todo is Not Done Yet")) {
                  let data = todo;
                  Toast(`Deleted - ${data[index].data}`, "", "error");

                  data.splice(index, 1);
                  setTodo([...data]);
                  localStorage.setItem("Todo", JSON.stringify(data));
                } else {
                  Toast("You Canceled The Operation", "", "success");
                }
              } else {
                let data = todo;
                Toast(`Deleted - ${data[index].data}`, "", "warning");
                data.splice(index, 1);
                setTodo([...data]);
                localStorage.setItem("Todo", JSON.stringify(data));
              }
              return 1;
            }}
          >
            <DeleteIcon />
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <div className="ToDoHeading">TODKU</div>
      <form
        className="Adder"
        onSubmit={(event) => {
          handleAdd(event);
        }}
      >
        <input
          autoFocus
          placeholder="Enter Tasks"
          type="text"
          maxLength={30}
          value={data.data}
          onChange={(d) => {
            setData({ data: capitalizeFirstLetter(d.target.value), state: 0 });
          }}
        />
        <button
          onSubmit={(event) => {
            handleAdd(event);
          }}
        >
          Add
        </button>
      </form>

      <div className="List">
        {todo.length ? (
          completed === 2 ? (
            todo.map((d, index) => {
              return <Item index={index} d={d} />;
            })
          ) : completed === 0 ? (
            todo.filter((e) => e.state === 0).length === 0 ? (
              <div className="NoList">No Task Left...</div>
            ) : (
              todo
                .filter((e) => e.state === 0)
                .map((d, index) => {
                  return <Item index={index} d={d} />;
                })
            )
          ) : completed === 1 ? (
            todo.filter((e) => e.state === 1).length === 0 ? (
              <div className="NoList">No Completed Task...</div>
            ) : (
              todo
                .filter((e) => e.state === 1)
                .map((d, index) => {
                  return <Item index={index} d={d} />;
                })
            )
          ) : (
            <div className="NoList">Error Please Refresh...</div>
          )
        ) : (
          <div className="NoList">No Tasks Yet...</div>
        )}

        {todo.length ? (
          <>
            <div className="Status">
              <div className="NumOfItems">
                {completed === 1
                  ? todo.filter((e) => e.state === 1).length +
                    " Items Completed"
                  : completed === 0
                  ? todo.filter((e) => e.state === 0).length + " Items Left"
                  : todo.length + " Items Total"}
              </div>
              <div className="Classifier">
                <div
                  onClick={() => {
                    setCompleted(2);
                  }}
                  className={completed === 2 ? "Text active" : "Text"}
                >
                  All
                </div>
                <div
                  onClick={() => {
                    setCompleted(1);
                  }}
                  className={completed === 1 ? "Text active" : "Text"}
                >
                  Completed
                </div>
                <div
                  onClick={() => {
                    setCompleted(0);
                  }}
                  className={completed === 0 ? "Text active" : "Text"}
                >
                  Left
                </div>
              </div>
              <div
                className="Clear"
                onClick={() => {
                  let data = todo;
                  if (data.some((e) => e.state === 1)) {
                    data = data.filter((e) => e.state !== 1);
                    console.log(data);
                    setTodo([...data]);
                    localStorage.setItem("Todo", JSON.stringify([...data]));
                    Toast("Deleted all completed tasks", "", "success");
                  } else {
                    Toast("No Completed Tasks", "", "warning");
                  }
                }}
              >
                Clear Completed
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="Info">Click On To Do Title To Complete</div>
    </div>
  );
}

export default App;
