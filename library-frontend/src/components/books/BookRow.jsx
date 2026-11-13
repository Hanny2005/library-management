import BookCard from './BookCard';

/** Dải sách cuộn ngang (dùng ở trang chủ) */
export default function BookRow({ books }) {
  return (
    <div className="scrollbar-thin -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pt-1 pb-4 sm:mx-0 sm:px-0">
      {books.map((book) => (
        <div key={book.id} className="w-40 shrink-0 snap-start sm:w-44">
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
