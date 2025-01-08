import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center mt-14">
      <h2 className="text-xl font-bold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="text-blue-600">
        Return Home
      </Link>
    </div>
  );
}
