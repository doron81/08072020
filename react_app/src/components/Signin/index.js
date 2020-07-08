import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../../services/auth.service";

const SignupSchema = yup.object().shape({
	password: yup.string().required().min(8),
	username: yup
		.string()
		.required()
		.test("White spaces", "White spaces are not allowed", function (
			value
		) {
			if (value.indexOf(" ") !== -1) {
				return false;
			}
			return true;
		}),
});

export default function SignIn(props) {
	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(SignupSchema),
	});

	const onSubmit = async (values) => {
		const response = await AuthService.login(
			values.username,
			values.password
		);
		console.log(response);
		if (response.success === "true") {
			props.history.push("/");
			window.location.reload();
		} else if (response.success === "false") {
			toast.error(response.msg, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	};

	return (
		<div>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>Username</label>
					<input type="text" name="username" ref={register} />
					{errors.username && <p>{errors.username.message}</p>}
				</div>
				<div>
					<label>Password</label>
					<input
						type="password"
						name="password"
						ref={register}
					/>
					{errors.password && <p>{errors.password.message}</p>}
				</div>
				<input type="submit" value="Log in" />
			</form>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</div>
	);
}
