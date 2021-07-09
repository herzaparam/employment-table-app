import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

import { ToastContainer, toast } from 'react-toastify';

function ModalInsert({ getList, province }) {
    const imageRef = useRef(null);

    const [selectedProvince, setSelectedProvince] = useState("")
    const [city, setCity] = useState([])
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        dob: "",
        province: "",
        city: "",
        street: "",
        ktpNumber: "",
        image: "",
    });
    const [error, setError] = useState(false)

    const getCity = (cityID) => {
        axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${cityID}`)
            .then((res) => {
                setCity(res.data.kota_kabupaten)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        })
    }

    const handleChangeImage = (e) => {
        setForm({
            ...form,
            image: e.target.files[0],
        })
    }

    const validate = () => {
        if (form.firstname === "" || form.lastname === "" || form.dob === "" || form.province === "" || form.city === "" || form.street === "" || form.ktpNumber === "" || form.ktpFile === "") {
            setError(true)
        }
    }

    const handleInsert = async () => {
        await validate()

        const formData = new FormData();
        formData.append('firstname', form.firstname)
        formData.append('lastname', form.lastname)
        formData.append('dob', form.dob)
        formData.append('province', form.province)
        formData.append('city', form.city)
        formData.append('street', form.street)
        formData.append('ktpNumber', form.ktpNumber)
        formData.append('image', form.image)
        axios.post(`${process.env.REACT_APP_API_TABLE}users/`, formData)
            .then((res) => {
                toast.success('Insert succesfull!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                getList()
            }).catch((err) => {
                toast.error('failed to insert data!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        imageRef.current.value = ""
        setForm({
            firstname: "",
            lastname: "",
            dob: "",
            province: "",
            city: "",
            street: "",
            ktpNumber: "",
            image: null
        })
    }
    const handleProvince = (e) => {
        const newProvince = JSON.parse(e)
        setForm({
            ...form,
            province: newProvince.name
        })
        setSelectedProvince(newProvince.id)
    }

    useEffect(() => {
        if (selectedProvince !== "") {
            getCity(selectedProvince)
        }
    }, [selectedProvince])

    return (
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Insert Employee</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">

                        <div className="input-group mb-3">
                            <label htmlFor="firstname" className="form-label">First Name</label>
                            <input type="text" className="form-control" id="firstname" value={form.firstname} aria-describedby="basic-addon3" onChange={e => handleChange(e)} />
                        </div>
                        <div className="input-group mb-3">
                            <label htmlFor="lastname" className="form-label">Last Name</label>
                            <input type="text" className="form-control" id="lastname" value={form.lastname} aria-describedby="basic-addon3" onChange={e => handleChange(e)} />
                        </div>
                        <div className="input-group mb-3">
                            <label htmlFor="dob" className="form-label">Date Of Birth</label>
                            <input type="date" className="form-control" id="dob" value={form.dob} aria-describedby="basic-addon3" onChange={e => handleChange(e)} />
                        </div>
                        <div className="input-group mb-3">
                            <label htmlFor="basic-url" className="form-label" >Province</label>
                            <select className="form-select" aria-label="Default select example" id="province" value={form.province} onChange={e => handleProvince(e.target.value)}>
                                <option defaultValue>Select Province..</option>
                                {province.map((item) => {
                                    return <option value={JSON.stringify({ name: item.nama, id: item.id })} key={item.id} >{item.nama}</option>
                                })}
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <label htmlFor="basic-url" className="form-label">City</label>
                            <select className="form-select" aria-label="Default select example" id="city" value={form.city} onChange={e => handleChange(e)}>
                                <option defaultValue>Select City..</option>
                                {city.map((item) => {
                                    return <option value={item.id} key={item.id}>{item.nama}</option>
                                })}
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <label htmlFor="street" className="form-label">Street</label>
                            <textarea className="form-control" aria-label="With textarea" id="street" value={form.street} onChange={e => handleChange(e)}></textarea>
                        </div>
                        <div className="input-group mb-3">
                            <label htmlFor="ktpNumber" className="form-label">KTP Number</label>
                            <input type="text" className="form-control" id="ktpNumber" value={form.ktpNumber} aria-describedby="basic-addon3" onChange={e => handleChange(e)} />
                        </div>
                        <div className="input-group mb-3">
                            <label className="input-group-text" htmlFor="image">Upload</label>
                            <input type="file" ref={imageRef} className="form-control" id="image" onChange={e => handleChangeImage(e)} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <p className={error === true ? "text-error" : "none"}>You need to fill all fields to insert data</p>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleInsert}>Insert</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ModalInsert
