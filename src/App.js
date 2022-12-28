import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { API } from './API/api';
import './App.css';

// binding modal to the root
ReactModal.setAppElement("#root");

function App() {

  // dropdown array data
  const options = [
    {
      label: "First Name",
      value: "first_name",
    },
    {
      label: "Last Name",
      value: "last_name",
    },
    {
      label: "Age",
      value: "age",
    },
    {
      label: "Account Name",
      value: "account_name",
    },
    {
      label: "City",
      value: "city",
    },
    {
      label: "State",
      value: "state",
    },
  ];

  // state to toggle the modal
  const [modalIsOpen, setIsOpen] = useState(false);

  // state to get the segment name
  const [segmentName, setSegmentName] = useState("")

  // showing dropdown based on the array
  const [remaining, setRemaining] = useState(options)
  const [added, setAdded] = useState([])

  // store the selected dropdown keyvalue pair and its index in the array
  const [select, setSelect] = useState(null)
  const [remove, setRemove] = useState(null)

  // checking the changes in the array object
  useEffect(() => {
    console.log(remaining);
    console.log(added);
  }, [remaining, added])

  // store the selected dropdown keyvalue pair and its index in the array
  const handleChange = (e) => {
    const value = Object.values(remaining)[e.target.value];
    setRemove(e.target.value);
    setSelect(value);
  }

  // performing operations when the add new schema button is clicked using "select" and "remove" states
  const addToSchema = (e) => {

    // adding conditionally only when the dropdown element is selected
    // adding the selected element and removing it from the remaining array
    if (select !== null && remove !== null) {
      setAdded([...added, select]);
      let data = [...remaining];
      data.splice(remove, 1);
      setRemaining(data);
      document.getElementById('selectValue').value = "Add schema to segment";
    }

    // setting to default
    setRemove(null);
    setSelect(null);
    e.preventDefault();
  }

  // changing values dynamically from the added elements(Blue box)
  const handleBothChange = (e, index) => {

    // storing the values to swap 
    let a = Object.values(added)[index];
    let b = Object.values(remaining)[e.target.value];

    // storing data from "remaining" to "added" array without slicing when the index matches
    const newState1 = added.map((obj, i) => {
      if (i === index) {
        return b;
      }
      return obj;
    });

    setAdded(newState1);

    // storing data from "added" to "remaining" array without slicing when the index matches
    const newState2 = remaining.map((obj, j) => {
      if (j === Number(e.target.value)) {
        return a;
      }
      return obj;
    });

    setRemaining(newState2);
  }

  // removing elements from blue box
  const removeFromBlueBox = (e, index) => {
    let a = Object.values(added)[index];
    let data = [...added];
    data.splice(index, 1);
    setAdded(data);
    setRemaining([...remaining, a])
    e.preventDefault();
  }

  // sending data to the webhook server
  const saveTheSegment = (e) => {

    let obj = {};
    const newArr = [];

    // finally converting the "added" array to desired format of keyvalue pairs 
    // i.e., only the values of the keys(label and value)
    added.forEach((pair) => {
      obj[pair.value] = pair.label;
      console.log(obj)
      newArr.push(obj);
      obj = {};
    });

    // sending data using fetch post method
    fetch(API, {

      mode: 'no-cors',

      // Adding method type
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify({
        "segment_name": segmentName,
        "schema": newArr
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      //setting to defalut
      .then(() => {
        setRemaining(options);
        setAdded([]);
        setSegmentName("");
      })

    e.preventDefault();
  }

  // setting to default
  const reset = (e) => {
    setRemaining(options);
    setAdded([]);
    setSegmentName("");
    setIsOpen(false);
    e.preventDefault();
  }

  // opens modal when true
  function openModal() {
    setIsOpen(true);
  }

  // closes modal when false
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="App">
      <header className='Header'>
        {"<"} View Audience
      </header>
      <button className='HomePageButton' onClick={openModal}>Save segment</button>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="Modal"
      >
        <header className='Header' style={{ cursor: "pointer" }} onClick={reset}>
          {"<"} Saving Segment
        </header>
        <form onSubmit={saveTheSegment} className='Segment__Form'>
          <div className="form-group mt-2 mb-3">
            <label htmlFor="segmentName" className='mb-3'>Enter the name of the segment</label>
            <input type="text" className="form-control" id="segmentName" value={segmentName}
              placeholder="Name of the segment" onChange={e => setSegmentName(e.target.value)}
            />
          </div>
          <div className='Segment__Inputs'>
            <p>To save your segment, you need to add the schemas to build the query</p>
            <div className='BlueBox'>
              {
                added.map((option, index) => (
                  <div key={index} className="BlueBoxItems">
                    <select value={option.value} className='form-control' onChange={e => { handleBothChange(e, index) }}>
                      <option value={option.value}>{option.label}</option>
                      {remaining.map((option, i) => (
                        <option key={i} value={i}>{option.label}</option>
                      ))}
                    </select>
                    <button className='Remove__Button' onClick={e => removeFromBlueBox(e, index)}>-</button>
                  </div>
                ))
              }
            </div>
            <select defaultValue="Add schema to segment" onChange={handleChange} className='form-control mb-3' id='selectValue' required>
              <option disabled>Add schema to segment</option>
              {remaining.map((option, index) => (
                <option key={index} value={index}>{option.label}</option>
              ))}
            </select>
            <p className='AddSchemaButton' onClick={addToSchema}>+ <span style={{ textDecoration: "underline" }}>Add new schema</span></p>
          </div>
          <footer className='Footer'>
            <button type='submit' className='Button__1'>Save the segment</button>
            <button onClick={reset} className='Button__2'>Cancel</button>
          </footer>
        </form>
      </ReactModal>
    </div>
  );
}

export default App;
