import { SpatialProvider } from './context/SpatialContext';
import { Sidebar } from './components/Sidebar';
import { Map } from './components/Map';

function App() {
  return (
    <SpatialProvider>
      <Sidebar />
      <Map />
    </SpatialProvider>
  );
}

export default App;
