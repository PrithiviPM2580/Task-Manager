import UserProvider from "./context/userContext";
import AppRoute from "./routes/AppRoute";

const App = () => {
  return (
    <UserProvider>
      <AppRoute />
    </UserProvider>
  );
};

export default App;
