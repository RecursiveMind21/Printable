interface Props {
  searchParams: { id?: string };
}
interface File {
  fileUrl: string;
  view: boolean;
  sign: boolean;
}

async function getFiles(fileId: string, userId: string) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/esign/sign-document/${fileId}/${userId}`,
    );
    const data = await res.json();
    console.log(data);
    return { fileUrl: data.fileUrl, view: data.view, sign: data.sign };
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}
export default async function SignDocument({ searchParams }: Props) {
  const { id } = await searchParams;
  const userId = 1;
  let file: File | null = await getFiles(id, userId);

  return (
    <div className="flex items-center justify-center ">

      <div className="">
 
      <h1 className="my-10 text-green-400 ">Document to Sign</h1>
      {file ? (
        <>
          <img src={file?.fileUrl} width={300} alt="doc" />
          <p>View: {String(file?.view)}</p>
          <p>Sign: {String(file?.sign)}</p>
          {!file?.sign && <div className="text-red-600 p-2 rounded-lg bg-white"> You are not the singer for this document!</div>}

        </>
      ) : (
        <p>No data</p>
      )}

      </div>
         </div>
  );
}
