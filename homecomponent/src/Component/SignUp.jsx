import SignUpDetails from "../Component/SignUpDetails";
import SignUpForm from "../Component/SignUpForm";
const SignUp = () => {
    return (
        <div className="flex flex-row justify-center items-center py-16  bg-slate-900" >
            <SignUpDetails />
            <SignUpForm />
        </div>
    );
}
export default SignUp;