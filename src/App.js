import { KafkaProvider } from "./context/kafka.context";

import KafkaServiceTest from "./features/tests/TestKafka";

function App()
{
	return (
		<KafkaProvider>
			{/*Test Components*/}
			{/* <div>
				<KafkaServiceTest/>
			</div> */}
		</KafkaProvider>
	);
}

export default App;