import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

function Edit() {
    const history = useHistory();
    let { id } = useParams();

    const [province, setProvince] = useState([])
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
        phone: "",
        position: "",
        image: "",
    });
    const [error, setError] = useState(false);

    const getProvince = () => {
        axios.get(`https://dev.farizdotid.com/api/daerahindonesia/provinsi`)
            .then((res) => {
                setProvince(res.data.provinsi)
            })
            .catch((err) => {
                console.log(err);
            })
    }
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
        setError(false)
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
    const handleProvince = (e) => {
        setError(false)
        const newProvince = JSON.parse(e)
        setForm({
            ...form,
            province: newProvince.name
        })
        setSelectedProvince(newProvince.id)
    }
    const getPersonData = (id) => {
        axios.get(`${process.env.REACT_APP_API_TABLE}users/find-byid/${id}`)
            .then((res) => {
                setForm(res.data.data[0])

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

    const validate = () => {
        if (form.firstname === "" || form.lastname === "" || form.phone === "" || form.position === "" || form.dob === "" || form.province === "" || form.city === "" || form.street === "" || form.ktpNumber === "" || form.image === "") {
            setError(true)
        }
    }

    const handleUpdate = async (id) => {
        await validate()
        const formData = new FormData();
        formData.append('firstname', form.firstname)
        formData.append('lastname', form.lastname)
        formData.append('phone', form.phone)
        formData.append('position', form.position)
        formData.append('dob', form.dob)
        formData.append('province', form.province)
        formData.append('city', form.city)
        formData.append('street', form.street)
        formData.append('ktpNumber', form.ktpNumber)
        formData.append('image', form.image)
        axios.put(`${process.env.REACT_APP_API_TABLE}users/update-profile/${id}`, formData)
            .then((res) => {
                getPersonData(id)
                toast.success('Succesfully update this employee!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }).catch((err) => {
                toast.error('failed to update data!', {
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
    useEffect(() => {
        getProvince()
        if (id) {
            getPersonData(id)
        }
    }, [])
    useEffect(() => {
        if (selectedProvince !== "") {
            getCity(selectedProvince)
        }
    }, [selectedProvince])

    return (
        <div className="cont-edit">
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
            <button className="btn btn-dark my-btn" onClick={e => history.push("/")}>Home</button>
            <h2>Edit Profile</h2>
            <div className="input-group mb-3">
                <label htmlFor="firstname" className="form-label">First Name</label>
                <input type="text" className="form-control" id="firstname" value={form.firstname} aria-describedby="basic-addon3" onChange={e => handleChange(e)} />
            </div>
            <div className="input-group mb-3">
                <label htmlFor="lastname" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lastname" value={form.lastname} aria-describedby="basic-addon3" onChange={e => handleChange(e)} />
            </div>
            <div className="input-group mb-3">
                <label htmlFor="firstname" className="form-label">Phone Number</label>
                <input type="text" className="form-control" id="phone" value={form.phone} aria-describedby="basic-addon3" onChange={e => handleChange(e)} />
            </div>
            <div className="input-group mb-3">
                <label htmlFor="basic-url" className="form-label" >Position</label>
                <select className="form-select" aria-label="Default select example" id="position" onChange={e => handleChange(e)}>
                    <option defaultValue>Select Position </option>
                    <option value="Manager">Manager</option>
                    <option value="SuperVisor">SuperVisor</option>
                    <option value="Staff">Staff</option>
                    <option value="Designer">Designer</option>
                </select>
            </div>
            <div className="input-group mb-3">
                <label htmlFor="dob" className="form-label">Date Of Birth</label>
                <input type="date" className="form-control" id="dob" value={form.dob} aria-describedby="basic-addon3" onChange={e => handleChange(e)} />
            </div>
            <div className="input-group mb-3">
                <label htmlFor="basic-url" className="form-label" >Province</label>
                <select className="form-select" aria-label="Default select example" id="province" onChange={e => handleProvince(e.target.value)}>
                    <option defaultValue>Select Province..</option>
                    {province.map((item) => {
                        return <option value={JSON.stringify({ name: item.nama, id: item.id })} key={item.id} >{item.nama}</option>
                    })}
                </select>
            </div>
            <div className="input-group mb-3">
                <label htmlFor="basic-url" className="form-label">City</label>
                <select className="form-select" aria-label="Default select example" id="city" onChange={e => handleChange(e)}>
                    <option defaultValue>Select City..</option>
                    {city.map((item) => {
                        return <option value={item.nama} key={item.id}>{item.nama}</option>
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
                <input type="file" className="form-control" id="image" onChange={e => handleChangeImage(e)} />
            </div>
            <p className={error === true ? "text-error" : "none"}>You need to fill all fields to update data</p>
            <button className="btn btn-primary my-btn-1" onClick={e => handleUpdate(id)}>Update</button>
        </div>
    )
}

export default Edit
