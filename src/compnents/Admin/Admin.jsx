import React, { useState } from "react";
import "./Admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { auth, db, storage } from "../../firebase";

const Admin = () => {
  const history = useHistory();
  const [isLogged, setIsLogged] = useState(false);
  const [admin, setAdmin] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [stock, setStock] = useState();
  const [progress, setProgress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [product, setProduct] = useState("");

  // admin logout
  const adminLogout = () => {
    auth.signOut();
    history.push("/admin/login");
  };

  // set value in proper format
  var properCategory = null;
  var properSubCategory = null;
  var properProduct = null;
  if (category) {
    if (category === "Electronics") {
      properCategory = "electronic";
      if (subCategory === "Laptop") {
        properSubCategory = "laptop";
        if (product === "Gaming Laptop") {
          properProduct = "gaming";
        } else if (product === "MacBook") {
          properProduct = "macbook";
        } else {
          properProduct = null;
        }
      } else if (subCategory === "Mobile") {
        properSubCategory = "mobile";
        if (product === "Infinix") {
          properProduct = "infinix";
        } else if (product === "Samsung") {
          properProduct = "samsung";
        } else if (product === "iPhone") {
          properProduct = "iphone";
        } else {
          properProduct = null;
        }
      } else if (subCategory === "Tablet") {
        properProduct = "tablet";
      } else {
        properProduct = null;
      }
    } else if (category === "Men Fashion") {
      properCategory = "menFashion";
      if (subCategory === "Casual Shirts") {
        properProduct = "casualShirts";
      } else if (subCategory === "T-shirt") {
        properProduct = "tShirts";
      } else {
        properProduct = null;
      }
    } else if (category === "Tv & Home Appliances") {
      properCategory = "homeAppliance";
      if (subCategory === "Air Conditioner") {
        properProduct = "airConditioner";
      } else if (subCategory === "Home Audio") {
        properProduct = "soundBars";
      } else if (subCategory === "TV & Video Devices") {
        properSubCategory = "videoDevices";
        if (product === "LED Television") {
          properProduct = "ledTv";
        } else if (product === "Projectors") {
          properProduct = "projector";
        } else {
          properProduct = null;
        }
      }
    } else {
      properCategory = null;
    }
  }
  // =================== end ================
  // auth listener login or logout
  auth.onAuthStateChanged(function(user) {
    if (user && user.displayName === "admin") {
      // User is signed in.
      // console.log(user);
      setAdmin(user.email);
      setIsLogged(true);
    } else {
      // No user is signed in.
      setIsLogged(false);
      alert("this page only for admin");
    }
  });

  // ====================== category array ==================
  const Electronics = ["Laptop", "Mobile", "Tablet"];
  const Men_Fashion = ["Casual Shirts", "T-shirt"];
  const Tv_and_Home_Appliances = [
    "Air Conditioner",
    "Home Audio",
    "TV & Video Devices",
  ];

  //======= sub category =======
  // sub category electronic
  const Laptop = ["Gaming Laptop", "MacBook"];
  const Mobile = ["Infinix", "Samsung", "iPhone"];

  // sub category home appliance
  const Home_Audio = ["Portable Players", "Sound Bars"];
  const TV_and_Video_Devices = ["LED Television", "Projectors"];

  // handle image uploader
  const uploadFile = event => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  // add product in database
  const handleAddProduct = event => {
    event.preventDefault();
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      //'state_changed' observer, called any time the state changes
      "state_changed",
      snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress);
      },
      error => {
        // Handle unsuccessful uploads
        alert(error.message);
      },
      () => {
        // Handle successful uploads on complete
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            // add download image url and caption into database

            if (properSubCategory) {
              db.collection(
                `products/${properCategory}/${properSubCategory}/${properProduct}/${properProduct}`
              ).add({
                description: description,
                image: url,
                price: price,
                stock: stock,
                title: title,
              });
              setProgress(0);
              setDescription("");
              setImage("");
              setPrice("");
              setStock("");
              setTitle("");
            } else {
              db.collection(`products/${properCategory}/${properProduct}`).add({
                description: description,
                image: url,
                price: price,
                stock: stock,
                title: title,
              });
              setProgress(0);
              setDescription("");
              setImage("");
              setPrice("");
              setStock("");
              setTitle("");
            }
          });
      }
    );
  };

  return (
    <div>
      {isLogged ? (
        <>
          <div className="admin__info">
            <h3>{admin}</h3>
            <Button
              className="m-5 float-right"
              variant="primary"
              onClick={adminLogout}
            >
              Logout
            </Button>
          </div>
          <div className="user__records">
            <Form className="container my-5">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  onChange={e => setTitle(e.target.value)}
                  value={title}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Price"
                  onChange={e => setPrice(e.target.value)}
                  value={price}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Stock"
                  onChange={e => setStock(e.target.value)}
                  value={stock}
                />
              </Form.Group>
              {/* ========== category =============== */}
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select Category</Form.Label>
                <Form.Control
                  as="select"
                  onChange={e => setCategory(e.target.value)}
                  defaultValue="Choose Category..."
                >
                  <option>Choose Category...</option>
                  <option>Electronics</option>
                  <option>Men Fashion</option>
                  <option>Tv & Home Appliances</option>
                </Form.Control>
              </Form.Group>
              {/* ========== sub category =============== */}
              {category ? (
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select Sub Category</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={e => setSubCategory(e.target.value)}
                    defaultValue="Choose Sub Category..."
                  >
                    <option>Choose Sub Category...</option>
                    {category === "Electronics"
                      ? Electronics.map(item => <option>{item}</option>)
                      : category === "Men Fashion"
                      ? Men_Fashion.map(item => <option>{item}</option>)
                      : category === "Tv & Home Appliances"
                      ? Tv_and_Home_Appliances.map(item => (
                          <option>{item}</option>
                        ))
                      : ""}
                  </Form.Control>
                </Form.Group>
              ) : (
                ""
              )}

              {/* ========== product =============== */}
              {subCategory ? (
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select Product Item</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={e => setProduct(e.target.value)}
                    defaultValue="Choose Product Item..."
                  >
                    <option>Choose Product Item...</option>
                    {subCategory === "Laptop"
                      ? Laptop.map(item => <option>{item}</option>)
                      : subCategory === "Mobile"
                      ? Mobile.map(item => <option>{item}</option>)
                      : subCategory === "Home Audio"
                      ? Home_Audio.map(item => <option>{item}</option>)
                      : subCategory === "TV & Video Devices"
                      ? TV_and_Video_Devices.map(item => (
                          <option>{item}</option>
                        ))
                      : ""}
                  </Form.Control>
                </Form.Group>
              ) : (
                ""
              )}

              {/* ================== end category =================== */}

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={e => setDescription(e.target.value)}
                  value={description}
                />
              </Form.Group>
              <Form>
                <Form.Group>
                  <Form.File
                    id="exampleFormControlFile1"
                    label="Select Product Image"
                    accept="image/*"
                    required
                    onChange={uploadFile}
                  />
                </Form.Group>
              </Form>
              <Button variant="primary" onClick={handleAddProduct}>
                Add
              </Button>
            </Form>
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <h1>Sorry You Need to Login...</h1>
          <Button
            variant="primary"
            onClick={() => history.push("/admin/login")}
          >
            Login
          </Button>
        </div>
      )}
    </div>
  );
};

export default Admin;
