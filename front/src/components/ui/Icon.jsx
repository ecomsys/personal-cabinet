export default function Icon({ name, className = "w-5 h-5 text-black" }) {
  return (
    <svg className={className}>
      <use
        xlinkHref={`${import.meta.env.BASE_URL}icons/sprite/sprite.svg#${name}`}
      />
    </svg>
  );
}