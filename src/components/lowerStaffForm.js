import React from "react";
import emptyProfile from "../assets/images/image.jpg";
import "../LowerStaff.css";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"
import { db } from "../firebase/config";
import { useState } from "react";

const lowerStaffForm = {
  firstname: "",
  lastname: "",
  email: "",
  cnic: "",
  dob: "",
  gender: "",
  address: "",
  phone: "",
  reference: "",
  lowerStaffPhoto: "",
  lowerStaffCnicPhoto: "",
  post: "",
  degree: "",
  experience: "",
  jobtype: "",
  salary: "",
  additionaldocuments: [],
};
const LowerStaffData = () => {
  const [lowerStaff, setLowerStaff] = useState(lowerStaffForm);
  const [lowerStaffPhotoURL, setlowerStaffPhotoURL] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false);
  
  
  const handleChange = (e) => {
    if (e.target.name === "photo") {
        setLowerStaff({ ...lowerStaff, [e.target.name]: e.target.files[0] });
        setlowerStaffPhotoURL(URL.createObjectURL(e.target.files[0]));
    } 
    else if (e.target.name === "additionaldocuments") {
        setLowerStaff({ ...lowerStaff, [e.target.name]: e.target.files });
    }
    else {
        setLowerStaff({ ...lowerStaff, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Create a reference to the lowerStaff collection
    const lowerStaffRef = db.collection("lowerStaff");
    const { lowerStaffPhoto, lowerStaffCnicPhoto ,additionaldocuments} = lowerStaff;
    const lowerStaffTextForm=lowerStaff;
    lowerStaffTextForm.lowerStaffPhoto="";
    lowerStaffTextForm.lowerStaffCnicPhoto="";
    // Create a storage reference
    const storageRef =  firebase.storage().ref();

    let lowerStaffPhotoURL = '';
    let lowerStaffCnicPhotoURL = '';
     
  await lowerStaffRef.add(lowerStaffTextForm).then(
    async(doc)=>{
      
      //Upload the files
     if (lowerStaffPhoto) {
      const photoSnapshot = await storageRef.child(`students/${doc.id}/lowerStaffPhoto`).put(lowerStaffPhoto);
      lowerStaffPhotoURL = await photoSnapshot.ref.getDownloadURL();
  }
  if (lowerStaffCnicPhoto) {
      const lowerStaffCnicPhotoSnapshot = await storageRef.child(`students/${doc.id}/lowerStaffCnicPhoto`).put(lowerStaffCnicPhoto);
      lowerStaffCnicPhotoURL = await lowerStaffCnicPhotoSnapshot.ref.getDownloadURL();
  }
  
  let additionalFiles=[];
  if (additionaldocuments) {
    for (var i = 0; i < additionaldocuments.length; i++) {
      const additionaldocumentsSnapshot = await storageRef.child(`students/${doc.id}/additionaldocument${i+1}`).put(additionaldocuments[i]);
        additionalFiles.push(await additionaldocumentsSnapshot.ref.getDownloadURL());
  }
      
  }

     // update the document with the file URLs
     await lowerStaffRef.doc(doc.id).update({
      lowerStaffPhoto: lowerStaffPhotoURL,
      lowerStaffCnicPhoto: lowerStaffCnicPhotoURL,
      additionaldocuments:additionalFiles
  })
      setIsSaving(false);
      setIsSuccessfullyAdded(true);
      // Setting lowerStaff form to init 
      setLowerStaff(lowerStaffForm);
      console.log("SuccessFully Added");
      setTimeout(()=>{
        // Removing the alert from top after 2s
        setIsSuccessfullyAdded(false);
      },2000);
    }
  )
  .catch((err)=>{
    console.log(err);
  })
  };

  return (
    <div className="add-student-form container mt-2 w-100 ">
      {(isSuccessfullyAdded)?<div class="alert alert-success alert-dismissible fade show" role="alert">
  Successfully Addded
</div>:""}
      <div>
        <h2 className="text-center">Lower Staff Admission Form</h2>
      </div>
      <form onSubmit={(e) => {handleSubmit(e);}}>
        {/* LowerStaff Photo */}
        <div className=" d-flex justify-content-center me-auto">
          <div>
            <img
              src={
                lowerStaff.lowerStaffPhoto === "" ? emptyProfile : lowerStaffPhotoURL
              }
              alt="lowerStaff "
              width={130}
            />
            <input
              className="ms-1"
              type="file"
              accept="image/*"
              name="lowerStaffPhoto"
              id="lowerStaffPhoto"
              onChange={(e) => {
                handleChange(e);
              }}
              required
            />
          </div>
          <span className="required">*</span>
        </div>
        {/* Main lowerStaff Information */}
        <div className="row mt-4">
          <div className="d-flex flex-column col">
            <label htmlFor="first-name">
              First Name:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="first-name"
              name="firstname"
              value={lowerStaff.firstname}
              placeholder='John'
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>

          <div className="d-flex flex-column col">
            <label htmlFor="last-name">
              Last Name:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="last-name"
              name="lastname"
              placeholder='Doe'
              value={lowerStaff.lastname}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
        </div>
        <div className="row mt-2">
          <div className="d-flex flex-column col">
            <label htmlFor="dob">
              Date of Birth:<span className="required">*</span>
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={lowerStaff.dob}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
          <div className="d-flex flex-column col">
            <label htmlFor="gender">
              Gender:<span className="required">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={lowerStaff.gender}
              className='px-2 py-1'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>


          <div className="d-flex flex-column col">
            <label htmlFor="phone">
              Phone Number:<span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder='03xx-xxxxxxx'
              value={lowerStaff.phone}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
        </div>
        <div className="d-flex flex-column mt-2">
          <label htmlFor="address">
            Address:<span className="required">*</span>
          </label>

          <textarea 
            type="text"
            id="address"
            name="address"
            className="px-2" 
            placeholder='Street Address'
            value={lowerStaff.address}
            rows="3"
            onChange={(e) => {
              handleChange(e);
            }}
            required
            ></textarea>

        </div>



        <div className="row mt-2">
          <div className="d-flex flex-column col">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='abc@gmail.com'
              value={lowerStaff.email}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
            ></input>
          </div>
          <div className="d-flex flex-column col">
            <label htmlFor="cnic">
              CNIC/B-Form:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="cnic"
              name="cnic"
              placeholder='33202-xxxxxxx-5'
              pattern="[0-9]{5}-[0-9]{7}-[0-9]"
              value={lowerStaff.cnic}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
            



          <div className="d-flex flex-column col">
            <div className="col">
              <label htmlFor="lowerStaffCnicPhoto">
                CNIC/B-Form:<span className="required">*</span>
              </label>
              <input
                type="file"
                id="lowerStaffCnicPhoto"
                name="lowerStaffCnicPhoto"
                className='px-2'
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>        
          </div>     

        </div>


        <div className="mt-2">
          <div className="d-flex flex-column col">
            <label htmlFor="jobtype">
            Job Type:<span className="required">*</span>
            </label>
            <select name="jobtype" className="px-2 py-1" id="jobtype" onChange={(e)=>{handleChange(e)}}>
              <option value="">Select Job Type</option>
              <option value="fgdfgdf">Full Time</option>
              <option value="fgdfgdf">Part Time</option>
              <option value="fgdfgdf">Permanent</option>
              <option value="fgdfgdf">Contract-Based</option>
            </select>
          </div>

          <div className="row mt-2">
            <div className="d-flex flex-column col">
            <label htmlFor="post">
            Job Post:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="post"
              name="post"
              value={lowerStaff.post}
              placeholder='Office Boy, Coffie Maker'
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
          <div className="d-flex flex-column col">
          <label htmlFor="experience">
                Experience In Years:<span className="required">*</span>
              </label>
            <input
              type="number"
              id="experience"
              name="experience"
              placeholder="5"
              value={lowerStaff.experience}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
            ></input>
          </div>
          <div className="d-flex flex-column col">
            <label htmlFor="salary">
              Salary:<span className="required">*</span>
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              placeholder="50000"
              value={lowerStaff.salary}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
          </div>

          <div className="row">
          <h3 className="text-center mt-4">Educational Status</h3>
          <div className="d-flex flex-column col">
            <label htmlFor="degree">
            Degree:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              placeholder="BS Computer Science"
              value={lowerStaff.degree}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>

        </div>
        </div>

        {/* Related Documents */}
          <div className="row mt-2 text-center">
            <div className="col">
              <label htmlFor="additional-documents">
                Additional Documents:
              </label>
              <input
                type="file"
                id="additional-documents"
                name="additionaldocuments"
                className='px-2'
                onChange={(e) => {
                  handleChange(e);
                }}
                multiple
              ></input>
            </div>
          </div>
        <div className="row mb-5 mt-3 ">
        <div className="d-flex justify-content-center ">
            {(isSaving)? <div className="spinner-border" role="status">
    <span className="visually-hidden">Saving...</span>
  </div>
:<button className=" btn-addstudent py-2 rounded col" type="submit" >
Save
</button>}
          
        </div>
        </div>
      </form>
    </div>
  );
};

export default LowerStaffData;