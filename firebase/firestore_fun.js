import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config";

async function addBook(book) {
  const bookRef = await addDoc(collection(db, "books"), {
    name: book.name,
    price: `${book.price}$`,
    author: book.author,
    image: book.imageUri,
    category: book.category,
    des: book.description,
    rate:0,
    rateCount:0,
  });
  const bookid = bookRef.id;
  await updateDoc(bookRef, {
    id: bookid,
  });
}
async function updateBook(book){
  const bookRef = doc(db,"books",book.id);
await updateDoc(bookRef,{
  name: book.name,
  price: `${book.price}$`,
  author: book.author,
  image: book.imageUri,
  category: book.category,
  des: book.description,
})
}
async function delete_BooK(id) {
  await deleteDoc(doc(db, "books", id));
  const querySnapshot = await getDoc(
    query(collection(db,"cart"), where("id", "==", book.id))
  );
  await deleteDoc(querySnapshot)
}

async function addToCart(uid, book) {
  const cartRef = collection(db, "cart");
  const querySnapshot = await getDocs(
    query(cartRef, where("id", "==", book.id))
  );
  if (!querySnapshot.empty) {
    throw new Error("This book is already in the cart.");
  }
  const BookRef = await addDoc(cartRef, {
    author: book.author,
    id: book.id,
    name: book.name,
    des: book.des,
    price: book.price,
    image: book.image,
    category: book.category,
    uid: uid,
  });
  await updateDoc(BookRef,{
    docId:BookRef.id
  })
}
async function deleteFromCart(id){
  await deleteDoc(doc(db, "cart", id));
}
async function getCarts(uid){
  const cartRef = collection(db, "cart");
  const temp = await getDocs(query(cartRef,("uid","==",uid)));
  const carts = temp.docs.map((doc) => ({ ...doc.data() }));
  return carts;
}
async function getBooks() {
  const bookRef = collection(db, "books");
  const temp = await getDocs(bookRef);
  const books = temp.docs.map((doc) => ({ ...doc.data() }));
  return books;
}
async function getBook(id) {
  const bookRef = doc(db, "books", id);
  const temp = await getDoc(bookRef);
  const book = temp.data();
  return book;
}
async function addCategory(category) {
  const catRef = await addDoc(collection(db, "categories"), {
    name: category.name,
    icon: category.icon,
  });
  const catId = catRef.id;
  await updateDoc(catRef, {
    id: catId,
  });
}
async function deleteCategory(category) {
  await deleteDoc(doc(db, "categories", category.id));
  const q = query(collection(db, "books"), ("category", "==", category.name));
  const snapshot = await getDocs(q);
  snapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
}
async function getCategories() {
  const catRef = collection(db, "categories");
  const temp = await getDocs(catRef);
  const categories = temp.docs.map((doc) => ({ ...doc.data() }));
  return categories;
}
async function calcRate(id,rate){
  const bookRef = doc(db, "books", id);
  const temp = await getDoc(bookRef);
  const book = temp.data();
  let _rate = book.rate;
  _rate+= rate;
  let rateCount = book.rateCount+1;
  
  if(rateCount==0){
    await updateDoc(bookRef, {
      rate: rate,
      rateCount: rateCount+1,
    });
  }else{
  const newRate = (_rate)/rateCount;
  await updateDoc(bookRef, {
    rate: newRate,
    rateCount: rateCount+1,
  });
}
}
async function getRate(id){
  const bookRef = doc(db,"books",id);
  const temp = await getDoc(bookRef);
  const book = temp.data();
  return book.rate;
}
export {
  addBook,
  delete_BooK as delet_BooK,
  getBooks,
  addCategory,
  deleteCategory,
  getCategories,
  getBook,
  addToCart,
  getCarts,
  deleteFromCart,
  calcRate,
  getRate,
  updateBook
};
