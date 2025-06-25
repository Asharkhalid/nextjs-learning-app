export default function Blob1({params}: {params: {reviewId: string[]}}) {
  if (params.reviewId?.length) {
    return (
      <>
        <div>Review {params?.reviewId[0]} </div>
        <div>Review {params?.reviewId[1]} </div>
        <div>Review {params?.reviewId[2]} </div>
      </>
    );
    // write 1 to 3 urls after http://localhost:3000/products/3/review
  } else {
    return <h1>No URL entered for review</h1>;
  }
}

// [[]] is used for catch all route segments optional
//  ... is used for getting array of dynamic URLs
