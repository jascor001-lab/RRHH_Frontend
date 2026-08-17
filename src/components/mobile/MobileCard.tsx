export default function MobileCard({ title, value }: any) {
  return (
    <div className="bg-[#123C34] p-4 rounded-xl mb-3">
      <p>{title}</p>
      <h2 className="text-lg">{value}</h2>
    </div>
  );
}