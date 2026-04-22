import { useLocation, Link } from "react-router-dom";

export function Breadcrumbs({ className }) {
  const location = useLocation();

  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <div className={`text-sm text-gray-500 flex gap-2 ${className}`}>
      <Link className="hover:text-black" to="/">Home</Link>

      {paths.map((p, i) => (
        <span key={i} className="flex gap-2">
          <span>/</span>
          <span className="capitalize">{p}</span>
        </span>
      ))}
    </div>
  );
}
