<?php 
	header('Content-Type: application/json');

	$uploaded = array();
	if (!empty($_FILES['file']['name'][0])) {
		foreach ($_FILES['file']['name'] as $position => $name) {
			list($width, $height, $type, $attr) = getimagesize($_FILES['file']['tmp_name'][$position]);
			$filesize = filesize($_FILES['file']['tmp_name'][$position]);
			if ($filesize > 10240000){
				$uploaded[] = array(
					'errmsg' => "Hình ảnh tối đa là 10MB"
				);
			}elseif ($width < 500 || $height < 300) {
				$uploaded[] = array(
					'errmsg' => "Hình ảnh phải ít nhất rộng 500px và 300px"
				);
			}else {
				if (move_uploaded_file($_FILES['file']['tmp_name'][$position], '../upload/images/'.$name)) {
					$uploaded[] = array(
						'name' => $name,
						'errmsg' => "",
						'file' => 'legal300/upload/images/'.$name
					);
					$_SESSION['LegalPetImage'] = $_FILES['file']['name'];
				}
			}
		}
	}
	echo json_encode($uploaded);

	//format image size to KB, MB, GB
	function formatSizeUnits($bytes)
    {
        if ($bytes >= 1073741824)
        {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        }
        elseif ($bytes >= 1048576)
        {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        }
        elseif ($bytes >= 1024)
        {
            $bytes = number_format($bytes / 1024, 2) . ' KB';
        }
        elseif ($bytes > 1)
        {
            $bytes = $bytes . ' bytes';
        }
        elseif ($bytes == 1)
        {
            $bytes = $bytes . ' byte';
        }
        else
        {
            $bytes = '0 bytes';
        }

        return $bytes;
	}
?>