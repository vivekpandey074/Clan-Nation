import { useEffect, useState } from "react";
import frontpage from "../../assets/frontpage.jpg";
import logo from "../../../public/ClanNationLogo3.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loaderSlice";
import { RegisterUser } from "../../apis/users";
import { toast } from "react-toastify";

const INVALID_NAME =
  "*must be 3-20 long, without space,digit & special character.";

const PASSWORD_INVALID_MSG =
  "*Password should be 8-20 characters and include at least 1 letter,1 number and 1 special character!";

export default function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    checkbox: false,
  });
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    checkbox: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { firstname, lastname, email, password, confirmpassword, checkbox } =
    formData;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckBox = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    if (e.target.checked) setErrors({ ...errors, checkbox: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkbox) {
      setErrors({ ...errors, checkbox: "*Please check the checkbox." });
      return;
    }

    if (password !== confirmpassword) {
      setErrors({
        ...errors,
        confirmpassword: "confirm password does not match with password.",
      });
      return;
    }

    try {
      dispatch(SetLoader(true));
      const response = await RegisterUser(formData);
      dispatch(SetLoader(false));
      if (response.success) {
        toast.success(response.message);
        navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Error occured while registeration!", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className=" w-full h-[100vh] bg-black ">
      <div className=" h-full flex flex-row  justify-center items-center bg-black overflow-auto ">
        <div className="h-full w-full flex flex-row max-w-[2000px]">
          <div className="relative w-1/2 h-full">
            <div className="absolute z-[99] w-full logo flex h-24 p-4  gap-4 ">
              <img src={logo} alt="" className="logo h-12" />
              <h1 className="md:text-4xl text-white">CLAN NATION</h1>
            </div>
            <img
              className="h-full w-full  absolute "
              src={frontpage}
              alt="Welcome Image"
            />
            <p className="supercell-font  absolute bottom-8 ms-4 inset-x-6 font-[900] z-[100] sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-7xl text-gray-200">
              Discover perfect set of people who believes in community growth.
            </p>
          </div>
          <div className="bg-black w-1/2 flex justify-center   max-w-[1500] overflow-y-scroll no-scrollbar ">
            <form
              className="text-white  flex flex-col  mt-[5vh] w-7/12  "
              onSubmit={handleSubmit}
            >
              <h1 className="font-singleDay text-center text-[#72DB73] md:text-4xl  xl:text-4xl 2xl:text-6xl font-[400]">
                Join Your Favourite Clan Today!
              </h1>
              <p className="font-Dmsans text-center my-2 font-[400]">
                Create your new account
              </p>
              <p className="font-Dmsans text-center  font-[400]">
                Already have an account?{" "}
                <span
                  className="cursor-pointer text-blue-300"
                  onClick={() => navigate("/login")}
                >
                  SignIn
                </span>
              </p>
              <div className="my-6 flex gap-2">
                <div className="w-1/2">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstname"
                    value={firstname}
                    pattern="^[A-Za-z]{3,20}$"
                    onChange={(e) => {
                      handleChange(e);
                      if (!e.target.checkValidity())
                        setErrors({ ...errors, firstname: INVALID_NAME });
                      else setErrors({ ...errors, firstname: "" });
                    }}
                    className="font-Dmsans p-5 bg-[#292929] w-full h-10  2xl:text-lg rounded-sm outline-none placeholder:text-[#7C7C7C] font-[400] 2xl:h-14"
                    required
                  />
                  <p className="font-[400] font-Dmsans  text-sm    text-[#FF0000]">
                    {errors.firstname}
                  </p>
                </div>
                <div className=" w-1/2">
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastname"
                    onChange={(e) => {
                      handleChange(e);
                      if (!e.target.checkValidity())
                        setErrors({ ...errors, lastname: INVALID_NAME });
                      else setErrors({ ...errors, lastname: "" });
                    }}
                    value={lastname}
                    pattern="^[A-Za-z]{3,20}$"
                    className="font-Dmsans p-5 bg-[#292929] w-full h-10  2xl:text-lg rounded-sm outline-none placeholder:text-[#7C7C7C] font-[400] 2xl:h-14"
                    required
                  />
                  <p className="font-[400] font-Dmsans  text-sm    text-[#FF0000]">
                    {errors.lastname}
                  </p>
                </div>
              </div>
              <div className="">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  className="font-Dmsans p-5  bg-[#292929] h-10  w-full outline-none 2xl:text-lg  rounded-sm placeholder:text-[#7C7C7C] font-[400] 2xl:h-14"
                  onChange={(e) => {
                    handleChange(e);
                    if (!e.target.checkValidity())
                      setErrors({ ...errors, email: "*Email must be valid" });
                    else setErrors({ ...errors, email: "" });
                  }}
                  required
                />
                <p className="font-[400] font-Dmsans text-sm  text-[#FF0000]">
                  {errors.email}
                </p>
              </div>
              <div className="my-6">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => {
                    handleChange(e);
                    if (!e.target.checkValidity())
                      setErrors({ ...errors, password: PASSWORD_INVALID_MSG });
                    else setErrors({ ...errors, password: "" });
                  }}
                  value={password}
                  className="font-Dmsans p-5 bg-[#292929] h-10  outline-none 2xl:text-lg  w-full rounded-sm placeholder:text-[#7C7C7C] font-[400] 2xl:h-14"
                  pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
                  autoComplete="off"
                  required
                />
                <p className="font-[400] font-Dmsans text-sm  text-[#FF0000]">
                  {errors.password}
                </p>
              </div>
              <div className="">
                {" "}
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmpassword"
                  onChange={(e) => {
                    handleChange(e);
                    if (!e.target.checkValidity())
                      setErrors({
                        ...errors,
                        confirmpassword: PASSWORD_INVALID_MSG,
                      });
                    else setErrors({ ...errors, confirmpassword: "" });
                  }}
                  value={confirmpassword}
                  className="font-Dmsans p-5  bg-[#292929] h-10    w-full 2xl:text-lg  outline-none rounded-sm placeholder:text-[#7C7C7C] font-[400] 2xl:h-14"
                  pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
                  autoComplete="off"
                  required
                />
                <p className="font-[400] font-Dmsans text-sm  text-[#FF0000]">
                  {errors.confirmpassword}
                </p>
              </div>

              <div>
                <label className="text-[#7C7C7C] font-[400] sm:text-sm   2xl:text-lg ">
                  <input
                    type="checkbox"
                    name="checkbox"
                    onChange={handleCheckBox}
                    checked={checkbox}
                    className="inline-block"
                  />{" "}
                  Share my registration data with Clan Nation.
                </label>
                <p className="font-[400]  text-sm font-Dmsans h-5 text-[#FF0000]">
                  {errors.checkbox}
                </p>
              </div>

              <button
                type="submit"
                className=" block cursor-pointer w-full font-roboto bg-[#72DB73]   h-10 rounded-3xl my-1 2xl:my-5 2xl:h-14"
              >
                Register
              </button>

              <p className="font-roboto  text-[#7C7C7C] font-[500] sm:text-xs mb-2 2xl:text-lg">
                By clicking on Sign up. you agree to Clan Nation{" "}
                <span className="text-[#72DB73] cursor-pointer">
                  Terms and Conditions of Use
                </span>
              </p>
              <p className="font-roboto text-[#7C7C7C] font-[500] sm:text-xs 2xl:text-lg">
                To learn more about how Clan Nation collects, uses, shares and
                protects your personal data please head Clan Nation{" "}
                <span className="text-[#72DB73] cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
