

import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Welcome from "./components/Welcome";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer";
import ContactForm from "./components/ContactForm";
import Cart from "./components/Cart";
import Gracias from "./components/Gracias";
import Footer from "./components/Footer";
import Test from "./components/pay/Test";
import ShoppingCartContextProvider from "./context/ShoppingCartContext";

const App = () => {
    return (
        <ShoppingCartContextProvider>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/catalogue" element={<ItemListContainer />} />
                    <Route path="/category/:category" element={<ItemListContainer />} />
                    <Route path="/item/:id" element={<ItemDetailContainer />} />
                    <Route path="/contact" element={<ContactForm />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/gracias" element={<Gracias />} />
                    <Route path="/test" element={<Test />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </ShoppingCartContextProvider>
    );
};

export default App;
