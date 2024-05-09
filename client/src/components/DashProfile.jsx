import { Alert, Avatar, Button, TextInput, Modal } from "flowbite-react";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess,
} from "../user/userSlice";
import { useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const filePicker = useRef();
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setshowModel] = useState(false);
  const navigate = useNavigate();

  console.log(currentUser.validUser.profilePicture);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    try {
      dispatch(updateStart());
      const res = await fetch(
        `https://mern-blog-api-snowy.vercel.app/api/user/update/${currentUser.validUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Users profile updated successfully");
      } else {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteUser = async () => {
    setshowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `https://mern-blog-api-snowy.vercel.app/api/user/delete/${currentUser.validUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async (e) => {
    try {
      const res = await fetch(
        "https://mern-blog-api-snowy.vercel.app/api/user/signout",
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const uploadImage = async () => {
    const imageRef = ref(storage, imageFile.name + new Date().getTime());
    const uploadTask = uploadBytesResumable(imageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading image:", error);
      },
      () => {
        // Upload complete, get download URL
        getDownloadURL(imageRef).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePicker}
          hidden
        />
        <div
          className="relative w-32 h-32  self-center cursor-pointer shadow-sm overflow-hidden rounded-full"
          onClick={() => filePicker.current.click()}
        >
          <Avatar
            alt="user"
            img={imageFileUrl || currentUser.validUser.profilePicture}
            rounded
            size="xl"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.validUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.validUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          ouline
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>

        <Link to={"/create-post"}>
          <Button
            type="button"
            gradientDuoTone={"purpleToPink"}
            className="w-full"
          >
            Create a post
          </Button>
        </Link>
      </form>
      <div className="text-red-500 flex justify-between mt-2.5">
        <span className="cursor-pointer" onClick={() => setshowModel(true)}>
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert className="mt-5" color={"success"}>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert className="mt-5" color={"failure"}>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert className="mt-5" color={"failure"}>
          {error}
        </Alert>
      )}
      <Modal
        show={showModel}
        onClose={() => setshowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setshowModel(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
