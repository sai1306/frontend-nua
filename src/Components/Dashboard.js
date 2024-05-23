import './../App.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';


function Dashboard() {
  const [completedata, setCompleteData] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [notedited, setnotedited] = useState(false);
  const [limit, setLimit] = useState(10);
  const [author, setAuthor] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [sort, setSort] = useState('');
  const rowdata = useRef(null);
  const tableData = useRef(null);
  const [editContent, seteditContent] = useState(false);
  const [idx, setIndex] = useState(-1);
  // Handler for selecting a dropdown item
  // const handleSelect = (eventKey) => {
  //   console.log(eventKey);
  //   setSelectedValue(eventKey);
  // };
  const authorInput = useRef(null)
  let [loading, setLoading] = useState(true);
  var docs = []
  var cols = ['author_name', 'birth_date', 'first_publish_year', 'ratings_average', 'subject', 'title', 'top_work']
  useEffect(() => {
    var response;
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!author)
          response = await fetch(`https://openlibrary.org/search.json?title=a&fields=key,title,author_name,first_publish_year,subject,author_birth_date,author_top_work,ratings_average&limit=${limit}&page=${page}`);
        else
          response = await fetch(`https://openlibrary.org/search.json?title=a&fields=key,title,author_name,first_publish_year,subject,author_birth_date,author_top_work,ratings_average&limit=${limit}&author=${author}`);
        setPage(page + 1);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        docs = result.docs;
        docs.forEach(async (item, index) => {
          const authorFetch = await fetch(`https://openlibrary.org/search/authors.json?q=${item.author_name[0]}&limit=1`);
          const authorData = await authorFetch.json();
          docs[index].birth_date = authorData.docs[0].birth_date;
          docs[index].top_work = authorData.docs[0].top_work;
        })
        setData(docs);
        setCompleteData(docs);
    

        setLoading(false);
      }
      catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [limit, author, notedited]);
  function pageSize(e) {
    setLimit(Number(e.target.innerHTML));
  }
  function fetchByAuthor(e) {
    if (e.key === 'Enter') {
      setAuthor(authorInput.current.value)
    }
  }
  function searchByAuthor(e){
    setAuthor(authorInput);
  }
  function downloadCSV(e) {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'table_data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function changeCol(e) {
    setSelectedValue(cols[e]);
  }

  function changeSort(e) {
    setSort(e);
  }

  function ableEdit(e) {
    var iconType = e.target.getAttribute('class').split(' ').at(-1)
    if(iconType === 'pencil'){
      seteditContent(true);
    }
    else{
      seteditContent(false);
      if(iconType === 'xmark'){
        setData(data);
        setnotedited(true);
      }
      
    }
  }
  function sortByOrder(e) {
    e.preventDefault();
    if (sort === 'No order') {
      setData(completedata);
      return;
    }
    var coldata = []
    data.forEach((element, index) => {
      if (selectedValue === 'author_name' || selectedValue === 'subject')
        coldata.push({ index, value: element[selectedValue][0] })
      else
        coldata.push({ index, value: element[selectedValue] })
    })
    if (sort === 'ascending') {
      coldata.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });
    }
    else if (sort === 'descending') {
      coldata.sort((a, b) => {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
      });
    }
    var tempdata = []
    for (let i = 0; i < coldata.length; i++) {
      tempdata[i] = data[coldata[i].index];
    }
    setData(tempdata);
  }
  return (
    <>
      <div className='container'>
        <h1 className='multi gradient-text'> <i className="fa-solid fa-book"></i> Books Archive</h1>
        <br />
        <input className='authorsearch' ref={authorInput} onKeyUp={fetchByAuthor} placeholder='Search books by author' />
        &nbsp; &nbsp;
        <button className='btn btns btn-primary' onClick={searchByAuthor}> <i class="fa-solid fa-magnifying-glass"></i> </button>
        <div className="container mt-5">
          <p>Number of books</p>    
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-secondary" onClick={pageSize}>10</button>
            <button type="button" className="btn btn-secondary" onClick={pageSize}>50</button>
            <button type="button" className="btn btn-secondary" onClick={pageSize}>100</button>
          </div>
          &nbsp;
          <button onClick={downloadCSV} className="btn btn-primary">Download CSV <i className="fa-solid fa-download"></i></button>
          &nbsp;
          <div className='right'>
            <form className='flexx' onSubmit={sortByOrder}>
              <DropdownButton onSelect={changeCol} title={selectedValue ? selectedValue : "Select Column"}>
                {cols.map((element, index) => {
                  return (
                    <Dropdown.Item eventKey={index}>{element}</Dropdown.Item>
                  );
                })}
              </DropdownButton>
              &nbsp; &nbsp;
              <DropdownButton onSelect={changeSort} title={sort ? sort : "Sorting Type"}>
                <Dropdown.Item eventKey='No order'>No order</Dropdown.Item>
                <Dropdown.Item eventKey='ascending'>Ascending</Dropdown.Item>
                <Dropdown.Item eventKey='descending'>Descending</Dropdown.Item>
              </DropdownButton>
              &nbsp; &nbsp;
              <button type='input' className='btn btn-secondary'>Sort</button>
            </form>
          </div>
          <br></br>
          {
            loading ?
              <div className='flexx p-5'>
                <ClipLoader
                  color='rgb(113, 112, 112)'
                  loading={loading}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
              :
              <div className="mt-3 table-responsive table-bordered">
                <table className="table table-striped table-sm">
                  <thead>
                    <tr className='table-active'>
                      <th>Ratings Average
                      </th>
                      <th>Author Name</th>
                      <th>Title</th>
                      <th>First Publish Year</th>
                      <th>Subject</th>
                      <th>Author Birth Date</th>
                      <th>Author Top Work</th>
                    </tr>
                  </thead>
                  <tbody>
                  {editContent ?
                            <div className='d-flex gap-3 p-2'>
                              <button onClick={ableEdit} className='btn btn-secondary'>
                                <i class="fa-solid fa-check check"></i>
                              </button>
                              <button onClick={ableEdit} className='btn btn-secondary'>
                                <i class="fa-solid fa-xmark xmark"></i>
                              </button>
                            </div>
                            :
                            <button onClick={ableEdit} className='btn'>
                              <i class="fa-solid fa-pencil pencil"></i>
                            </button>
                          }
                    {data.map((element, index) => {
                      return (
                        <>
                        <tr contentEditable={editContent} ref={tableData} className='pt-3' key={index}>
                          <td>
                            {(element.ratings_average) ? element.ratings_average : 'Unknown'}
                          </td>
                          <td>
                            {(element.author_name) ? element.author_name : 'Unknown'}
                          </td>
                          <td>
                            {(element.title) ? element.title : 'Unknown'}
                          </td>
                          <td className='pr-9'>
                            {(element.first_publish_year) ? element.first_publish_year : 'Unknown'}
                          </td>
                          <td className='small'>
                            {(element.subject) ? element.subject : 'Unknown'}
                          </td>
                          <td>
                            {(element['birth_date']) ? element.birth_date : 'Unknown'}
                          </td>
                          <td>
                            {(element.top_work) ? element.top_work : 'Unknown'}
                          </td>
                        </tr>
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
          }
        </div>
      </div>
    </>
  );
}

export default Dashboard;
