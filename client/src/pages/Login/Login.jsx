import { useEffect, useState } from "react";
import frontpage from "../../assets/frontpage.jpg";
import logo from "../../../public/ClanNationLogo3.png";
import { useNavigate } from "react-router-dom";
import { SetLoader } from "../../redux/loaderSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { LoginUser } from "../../apis/users";

const PASSWORD_INVALID_MSG =
  "*Password should be 8-20 characters and include at least 1 letter,1 number and 1 special character!";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {}, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(SetLoader(true));
      const response = await LoginUser(formData);

      dispatch(SetLoader(false));

      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.token);
        window.location.href = "/";
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      toast.error(err.message || "Error occurred while login", {
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
      <div className=" h-full flex flex-row  justify-center items-center bg-black overflow-auto overflow-y-scroll no-scrollbar  ">
        <div className="h-full w-full flex flex-row max-w-[2000px]">
          <div className="relative w-1/2 h-full">
            <div className="absolute z-[99] w-full logo flex h-24 p-4  gap-4 ">
              <img src={logo} alt="" className="logo h-12" />
              <h1 className="md:text-4xl  text-white">CLAN NATION</h1>
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
          <div className="bg-black w-1/2 flex justify-center   max-w-[1500] ">
            <form
              className="text-white  flex flex-col mt-[10vh] w-7/12  "
              onSubmit={handleSubmit}
            >
              <h1 className="font-singleDay text-center text-[#72DB73] md:text-4xl  xl:text-4xl 2xl:text-6xl font-[400]">
                Join Your Favourite Clan Today!
              </h1>
              <p className="font-Dmsans text-center my-2 font-[400]">
                Sign in to your account
              </p>
              <p className="font-Dmsans text-center  font-[400]">
                Don't have an account?{" "}
                <span
                  className="cursor-pointer text-blue-300"
                  onClick={() => navigate("/register")}
                >
                  SignUp
                </span>
              </p>
              <div className="my-3 mt-10">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={(e) => {
                    handleChange(e);
                    if (!e.target.checkValidity())
                      setErrors({ ...errors, email: "*Email must be valid" });
                    else setErrors({ ...errors, email: "" });
                  }}
                  value={email}
                  className="font-Dmsans p-5 bg-[#292929] w-full h-10  2xl:text-lg rounded-sm outline-none placeholder:text-[#7C7C7C] font-[400] 2xl:h-14"
                  required
                />
                <p className="font-[400] font-Dmsans h-5 text-sm    text-[#FF0000]">
                  {errors.email}
                </p>
              </div>

              <div className="">
                {" "}
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
                  className="font-Dmsans p-5  bg-[#292929] h-10    w-full 2xl:text-lg  outline-none rounded-sm placeholder:text-[#7C7C7C] font-[400] 2xl:h-14"
                  required
                  pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
                  autoComplete="off"
                />
                <p className="font-[400] font-Dmsans text-sm h-10 text-[#FF0000]">
                  {errors.password}
                </p>
              </div>

              <button
                type="submit"
                className=" cursor-pointer font-roboto bg-[#72DB73]  h-10 rounded-3xl my-2 2xl:my-5 2xl:h-14"
              >
                Login
              </button>
              <p className="font-roboto  text-[#7C7C7C] font-[500] sm:text-xs mb-2 2xl:text-lg">
                By clicking on Login. you agree to Clan Nation{" "}
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
