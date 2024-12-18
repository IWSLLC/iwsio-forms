import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

import { Routes } from './routes.js'

const client = new QueryClient()

export const App = () => (
	<QueryClientProvider client={client}>
		<BrowserRouter>
			<Routes />
		</BrowserRouter>
	</QueryClientProvider>
)

export default App
