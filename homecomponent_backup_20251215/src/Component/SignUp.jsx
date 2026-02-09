import SignUpDetails from "../Component/SignUpDetails";
import SignUpForm from "../Component/SignUpForm";
const SignUp = () => {
    return (
        <div className="flex flex-row justify-center items-center py-16  bg-gradient-to-r from-blue-500 to-cyan-500" >
            <SignUpDetails />
            <SignUpForm />
        </div>
    );
}
export default SignUp;