import React, { useState, useEffect } from 'react';
import ModalInsert from '../components/ModalInsert'
import ModalImage from '../components/ModalImage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Pagination from '../components/Pagination';

function Home() {
    const history = useHistory();

    const [selectedImage, SetSelectedImage] = useState(null)
    const [province, setProvince] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage, setPostPerPage] = useState(4)
    const [list, setList] = useState([])
    const [search, setSearch] = useState({
        name: "",
        position: ""
    });

    const handleChange = (e) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }
    const getList = (name, position) => {
        axios.get(`${process.env.REACT_APP_API_TABLE}users/find-all/?position=${position}&keyword=${name}&page=1&perPage=100`)
            .then((res) => {
                setList(res.data.data)
            })
            .catch((err) => {
                toast.warn('can not get list of employee', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            })
    }

    const getProvince = () => {
        axios.get(`https://dev.farizdotid.com/api/daerahindonesia/provinsi`)
            .then((res) => {
                setProvince(res.data.provinsi)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getList(search.name, search.position)
    }, [search])

    useEffect(() => {
        getProvince()
    }, [])

    const handleDelete = (id) => {
        axios.delete(`${process.env.REACT_APP_API_TABLE}users/${id}`)
            .then((res) => {
                alert("succesfully delete this list of employee")
                getList()
            })
            .catch((err) => {
                alert("cannot delete the list of employee")
            })

    }

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirsPost = indexOfLastPost - postPerPage;
    const currentList = list.slice(indexOfFirsPost, indexOfLastPost);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
  
    return (
        <div className="app">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <header className="container-fluid">
                <h2>List of Employee</h2>
                <label htmlFor="">Filter</label>
                <div className="input-group mb-3 w-half">
                    <input type="text" className="form-control mr-2" aria-label="Text input with dropdown button" placeholder="Name..." name="name" onChange={e => handleChange(e)} />
                    <select className="form-select" aria-label="Default select example" name="position" onChange={e => handleChange(e)}>
                        <option defaultValue>Position</option>
                        <option value="Manager">Manager</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Staff">Staff</option>
                        <option value="Designer">Designer</option>
                    </select>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end m-4">
                    <button className="btn btn-secondary me-md-2" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >Insert Employee</button>
                    <ModalInsert getList={getList} province={province} />
                </div>
            </header>
            <main className="container-fluid mb-3">
                <ModalImage image={selectedImage}/>
                <table className="table table-success table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">DOB</th>
                            <th scope="col">address</th>
                            <th scope="col">Current Position</th>
                            <th scope="col">KTP</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentList.map((person) => {
                            return (
                                <tr key={person.id}>
                                    <th className="align-middle text-start" scope="row">{person.firstname} {person.lastname}</th>
                                    <td className="align-middle">{person.phone !== "" ? person.phone : "not set"}</td>
                                    <td className="align-middle">{person.dob}</td>
                                    <td className="align-middle">{person.street}, {person.city}. {person.province}</td>
                                    <td className="align-middle">{person.position !== "" ? person.position : "not set"}</td>
                                    <td>
                                        <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#ModalImage" data-bs-whatever="displayimage" onClick={e => SetSelectedImage(person.image)}>image</button></td>
                                    <td>
                                        <button type="button" className="btn btn-info mx-1" onClick={e => history.push(`/edit/${person.id}`)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button type="button" className="btn btn-danger mx-1" onClick={e => handleDelete(person.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}



                    </tbody>
                </table>

            </main>
            <Pagination postPerPage={postPerPage} totalPost={list.length} paginate={paginate} />
        </div>
    )
}

export default Home
