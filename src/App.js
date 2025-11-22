import { Routes, Route, Navigate } from "react-router-dom";

import { useTheme } from "./hooks/useTheme";

import { ThemeProvider } from "./context/theme.context";
import { KafkaProvider } from "./context/kafka.context";

import NotFound from "./components/NotFound";
import { AuthLayout, AuthPages } from "./features/auth/index";

import KafkaServiceTest from "./features/tests/TestKafka";

import "./assets/styles/App.css";

function ThemeToggleButton() {
	const { toggleTheme } = useTheme();
	
	return (<button onClick={toggleTheme} style={{position: "absolute", top: "0", right: "0"}}>Toggle</button>);
}

function App()
{
	return (
		<main className="app">
			<ThemeProvider>
				<KafkaProvider>
					<ThemeToggleButton />
					{/*Test Components*/}
					{/* <div>
						<KafkaServiceTest/>
					</div> */}

					<Routes>
						<Route path="/" element={<Navigate to="auth/login" replace/>}/>

						<Route path="auth">
							<Route path="login" element={<AuthPages.Login/>}/>
							<Route path="register" element={<AuthPages.Register/>}/>
							<Route path="recovery" element={<AuthPages.Recovery/>}/>
						</Route>

						<Route path="*" element={<NotFound/>}/>
					</Routes>
				</KafkaProvider>
			</ThemeProvider>
		</main>
	);
}

export default App;