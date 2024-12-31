import { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaTruck, FaTimesCircle, FaExchangeAlt } from "react-icons/fa";
import Spinner from "../components/Spinner";

function ProductDetails() {
  const [mainImage, setMainImage] = useState(
    "https://rukminim2.flixcart.com/image/832/832/xif0q/sweatshirt/a/a/r/xl-lavender-abhinavs-best-of-world-original-imah75prsgfbrsxf.jpeg?q=70&crop=false"
  );
  const [openSection, setOpenSection] = useState(null);
  const { productId } = useParams(); // Retrieve the product ID from route parameters
  const [product, setProduct] = useState(null); // State to store product details
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const productDetailsRef = useRef(null);
  const { userId } = 123; 
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);

   // Fetch product details using the ID
   useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await fetch(
          `https://abhinasv-s-backend.onrender.com/api/product/getproduct/${productId}` // API endpoint for fetching product details
        );
        const data = await response.json();
        console.log(data);
        setProduct(data);
        setMainImage(data?.images?.[0]); // Set the first image as default
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async (productDetails) => {
    if (!userId) {
      // If the user is not logged in, you can redirect them to the login page
      navigate("/login");
      return;
    }
    const cartItem = {
      id: productDetails._id,
      size: "M", // Adjust based on your UI input for size
      color: "Lavender", // Adjust based on your UI input for color
      quantity: 1, // Adjust based on your UI input for quantity
      image: productDetails.images[0], // Use appropriate image
      title: productDetails.name,
      price: productDetails.price,
    };

    try {
      setCartLoading(true); // Set the loading spinner for cart action
      const response = await fetch(
        `https://abhinasv-s-backend.onrender.com/api/cart/addtocart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId: productDetails._id,
            items: [cartItem],
          }),
        }
      );
      const data = await response.json();
      if (data.cart) {
        alert("Product added to cart successfully!");
        // Optionally, you can update the cart state here or navigate to the cart page
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setCartLoading(false); // Hide spinner after cart action is complete
    }
  };



  // Adjusting scroll behavior with offset to account for potential fixed header or margin
  useEffect(() => {
    if (productDetailsRef.current) {
      window.scrollTo({
        top: productDetailsRef.current.offsetTop - 50,  // Adjust the offset (50px for header)
        behavior: "smooth", // Smooth scroll
      });
    }
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleThumbnailClick = (src) => {
    setMainImage(src);
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner /> {/* Display spinner during loading */}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div ref={productDetailsRef} className="bg-headerBackGround">
      <div className="container bg-headerBackGround mx-auto px-4 py-8">
        <div className="font-forumNormal bg-headerBackGround flex flex-wrap -mx-4">
          {/* Product Images */}
          <div className="w-full md:w-1/2 px-4 mb-8">
            <img
              src={mainImage}
              alt="Product"
              className="w-full h-auto rounded-lg shadow-md mb-4"
            />
            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => handleThumbnailClick(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-2">
             {product.name}
            </h2>
            <div className="mb-4 flex items-center gap-4">
              <span className="text-2xl font-semibold ">₹{product.price}</span>
              <span className="text-gray-500 line-through">₹{product.price + 500}</span>
            </div>
            <span className={`inline-block text-sm font-medium px-3 py-1 rounded mb-4 ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
            <p className="text-gray-700 mb-6">
              {product.description}
            </p>

            {/* Color Dropdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Color:</h3>
              <select
                className="block w-40 p-3 border bg-headerBackGround  text-lg focus:outline-none "
                defaultValue=""
              >
                <option value="" disabled>
                  Select color
                </option>
                {product.color.map((color) => ( 
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
               
              </select>
            </div>

            {/* Size Section with Radio Buttons */}
            <div className="mt-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Size:</h3>
              <div className="flex gap-4">
                {product.size.map((size) => (
                  <label key={size} className="flex items-center">
                    <input type="radio" name="size" value={size} className="hidden" />
                    <span className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 bg-white text-gray-800 cursor-pointer hover:bg-gray-200 transition duration-300">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery and Return Info */}
            <div className="mt-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <FaTruck className="text-green-600" size={20} />
                <span className="text-gray-700">Free Delivery Available </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <FaTimesCircle className="text-red-600" size={20} />
                <span className="text-gray-700">No Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <FaExchangeAlt className="text-blue-600" size={20} />
                <span className="text-gray-700">2-Day Size Exchange Only</span>
              </div>
            </div>


  {/* Gift Wrapping Option */}
{/* Gift Wrapping Option */}
<div className="flex items-center mb-3 mt-4">
 
  <label htmlFor="giftWrapping" className="flex items-center gap-2 text-gray-700 cursor-pointer">
    <img
      src="https://cdn-icons-png.flaticon.com/512/6664/6664427.png" // Replace with your preferred gift icon
      alt="Gift Icon"
      className="w-6 h-6"
    />
    Gift Wrapping available for an extra <span className="font-semibold">₹30</span>.
  </label>
  <input
    type="checkbox"
    id="giftWrapping"
    className="w-5 h-5 cursor-pointer rounded-lg accent-gray-600"
  />
</div>


            {/* Add to Cart Button */}
            <div className="flex w-full gap-4">
  <Link to="/cart" className="w-1/2">
    <button onClick={handleAddToCart} className="w-full py-3 text-lg rounded-lg font-semibold bg-[#E6FF87] text-black hover:bg-[#bac68f] transition duration-300">
      Add to Cart
    </button>
  </Link>

  {/* Add to Wishlist Button */}
  <button className="w-1/2 py-3 text-lg rounded-lg font-semibold bg-red-500 text-white hover:bg-red-700 transition duration-300">
    Add to Wishlist
  </button>
</div>

           

            {/* Product Details Dropdown */}
            <div className="mt-4 ">
              <button
                onClick={() => toggleSection("productDetails")}
                className="flex items-center justify-between w-40 text-lg mb-2  py-3 text-gray-800 bg-headerBackGround font-semibold focus:outline-none"
              >
                <span>Product Details</span>
                {openSection === "productDetails" ? (
                  <FaChevronUp className="ml-2 transition-transform duration-300" />
                ) : (
                  <FaChevronDown className=" ml-2 transition-transform duration-300" />
                )}
              </button>
              {openSection === "productDetails" && (
                <div className="px-4 py-3 bg-headerBackGround text-gray-700 font-forumNormal">
                 <p><strong>Fabric:- </strong> {product.details.fabric}</p>
                  <p><strong>Care Instructions:- </strong> {product.details.careInstructions}</p>
                  <p><strong>FabricCare:- </strong>{product.details.fabricCare}</p>
                  <p><strong>Hooded:- </strong> {product.details.hooded}</p>
                  <p><strong>KnitType:- </strong> {product.details.knitType}</p>
                  <p><strong>Material:- </strong> {product.details.material}</p>
                  <p><strong>Neck:- </strong> {product.details.neck}</p>
                  <p><strong>NetQuantity:- </strong> {product.details.netQuantity}</p>
                  <p><strong>Occasion:- </strong>{product.details.occasion}</p>
                  <p><strong>Origin:- </strong> {product.details.origin}</p>
                  <p><strong>Pattern:- </strong> {product.details.pattern}</p>
                  <p><strong>Pockets:- </strong> {product.details.pockets}</p>
                  <p><strong>Reversible:- </strong> {product.details.reversible}</p>
                  <p><strong>SecondaryColor:- </strong> {product.details.secondaryColor}</p>
                  <p><strong>ShippingInfo:- </strong> {product.details.shippingInfo}</p>
                  <p><strong>Sleeve:- </strong> {product.details.sleeve}</p>
                  <p><strong>StyleCode:- </strong> {product.details.styleCode}</p>
                  <p><strong>SuitableFor:- </strong> {product.details.suitableFor}</p>
                  {/* Add more details as needed */}
                </div>
              )}
            </div>

            {/* Return and Exchange Policy Dropdown */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection("returnPolicy")}
                className="flex items-center justify-between w-64 text-lg mb-2 py-3 text-gray-800 bg-headerBackGround font-semibold focus:outline-none"
              >
                <span>Return & Exchange Policy</span>
                {openSection === "returnPolicy" ? (
                  <FaChevronUp className="ml-2 transition-transform duration-300" />
                ) : (
                  <FaChevronDown className="ml-2 transition-transform duration-300" />
                )}
              </button>
              {openSection === "returnPolicy" && (
                <div className="px-4 py-3 bg-headerBackGround text-gray-700 font-forumNormal">
                  The brand does not accept returns, but replacements are possible subject to availability. Please initiate replacements from the 'My Orders' section in the App within 2 days of Delivery. The product must be in its original condition with all tags attached.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
