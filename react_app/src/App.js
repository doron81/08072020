import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service.js";

import Login from "./components/Signin";
import Register from "./components/Signup";
import Candidates from "./components/Candidates";
import Profile from "./components/Profile";

const App = () => {
	const [currentUser, setCurrentUser] = useState(undefined);

	useEffect(() => {
		const user = AuthService.getCurrentUser();

		if (user) {
			setCurrentUser(user);
		}
	}, []);

	const logOut = () => {
		AuthService.logout();
	};

	return (
		<Router>
			<div>
				<nav className="navbar navbar-expand navbar-dark bg-dark">
					<div className="navbar-nav mr-auto">
						<li className="nav-item">
							<Link
								to={
									!currentUser
										? "/login"
										: "/"
								}
								className="nav-link"
							>
								Home
							</Link>
						</li>
					</div>

					{currentUser ? (
						<div className="navbar-nav ml-auto">
							<li className="nav-item">
								<Link
									to={"/profile"}
									className="nav-link"
								>
									{currentUser.username}
								</Link>
							</li>
							<li className="nav-item">
								<a
									href="/login"
									className="nav-link"
									onClick={logOut}
								>
									LogOut
								</a>
							</li>
						</div>
					) : (
						<div className="navbar-nav ml-auto">
							<li className="nav-item">
								<Link
									to={"/login"}
									className="nav-link"
								>
									Sign In
								</Link>
							</li>

							<li className="nav-item">
								<Link
									to={"/register"}
									className="nav-link"
								>
									Sign Up
								</Link>
							</li>
						</div>
					)}
				</nav>

				<div className="container mt-3">
					<Switch>
						<Route
							exact
							path="/"
							component={Candidates}
						/>
						<Route exact path="/login" component={Login} />
						<Route
							exact
							path="/register"
							component={Register}
						/>
						<Route
							path="/profile"
							component={Profile}
						/>
					</Switch>
				</div>
			</div>
		</Router>
	);
};

export default App;
