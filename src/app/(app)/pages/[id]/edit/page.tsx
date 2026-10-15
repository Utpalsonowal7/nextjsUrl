import Editor from "@/components/bio/Editor";
export default async function EditBioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Editor key={id} id={id} />;
}
