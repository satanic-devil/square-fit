const editor = document.querySelector("#editor");

const downloadLink = document.querySelector("#download-link");
const file = document.querySelector("#user-file");
const ctx = editor.getContext("2d");
const demo = document.querySelector("#demo-image");
const notify = document.querySelector("#notify");


let imageWidth, imageHeight;
let imageFile = new Image();
let imageBlob;

let flag = 0;

file.onchange = (file) =>{
	let fileReader = new FileReader();
	fileReader.onload = (e) => {
		if( imageBlob ) URL.revokeObjectURL(imageBlob);
		flag = 0;
		notification1("Please Wait..");

		imageFile.onload = () =>{
			flag += 0.5;
			console.log(flag);
			showImage();
			demo.onload = ()=>{
				flag += 0.5;
				if( flag <=1)
					demo.style.display = "block";
				
			}
			demo.src = imageFile.src;
		}
		
		imageFile.src = e.target.result;
		
		
	};
	fileReader.readAsDataURL( file.target.files[0]);
}


function showImage(){
	getImageDetails();

	editor.width = imageWidth;
	editor.height = imageHeight;
	
	ctx.drawImage(imageFile, 0, 0);
}

function getImageDetails(){
	imageHeight = imageFile.height;
	imageWidth = imageFile.width;

}

function squarefit(){
	if( flag != 1 ){
		notification1("Please select an image.");	
		return;
	}

	notification1("Processing Image Please Wait...");	
	setTimeout(()=>{
	let editorHeight, editorWidth;
	let xOffset, yOffset;
	xOffset = yOffset = 0;
	
	editorHeight = imageHeight;
	editorWidth = imageWidth;
		
	if( imageHeight > imageWidth){
		xOffset = (imageHeight - imageWidth)/2;
		editorWidth = imageHeight;
	} else {
		yOffset = (imageWidth - imageHeight)/2;
		editorHeight = imageWidth;
	}
	editor.width = editor.height = editorHeight;
	demo.style.display = "none";
	demo.width = demo.height = editorHeight;
	console.log("2:Editor\n"+editor.height+" : " +editor.width);
	console.log("Demo\n"+demo.height+" : " +demo.width);	
	
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillRect(0,0,editorHeight, editorWidth);
	ctx.drawImage(imageFile, xOffset, yOffset);	
	demo.src = editor.toDataURL("image/jpg");
	demo.style.display = "block";
	demo.width = demo.height = editor.height;

	flag = 2;
	notification1("You can download the Image.");
	},500);
}

function download(){
	if( flag < 1){
		notification1("Please select an image.");		
		return;
	}
	editor.toBlob((blob)=>{
		imageBlob = blob;
		downloadLink.href = URL.createObjectURL(blob);
		downloadLink.click();
	},"image/jpeg");
}

function toggleNotification(){
	
	notify.classList.toggle("notify-anim");
	notify.classList.toggle("hide-notify");
}

function notification1(msg){
		notify.innerHTML = msg;
		notify.classList.toggle("hide-notify");
		notify.classList.toggle("notify-anim");
		setTimeout(toggleNotification, 1000);
}

function checkFlag(){
	console.log(flag);
	if( flag == 1){
		showImage();
		notification1("Image Ready.");
		return;
	}
}