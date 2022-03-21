<?php
	session_start();
	$mang_nn = array("vi","en","tq");
	if(!isset($_SESSION["nn"])){
		$_SESSION["nn"]="vi";
	}
	if(isset($_GET["lang"])){
		$lang = $_GET["lang"];
		if(in_array($lang,$mang_nn))
		$_SESSION["nn"] = $lang;
	}

	switch($_SESSION["nn"]){
		case "vi": require "languages/vi.php";
		break;
		case "tq": require "languages/tq.php";
		break;
		case "en": require "languages/en.php";
		break;
		default: require "languages/vi.php";
	}

	$ten = "ten_".$_SESSION["nn"];
	$mota = "mota_".$_SESSION["nn"];
	$mota1 = "mota1_".$_SESSION["nn"];
	$mota2 = "mota2_".$_SESSION["nn"];
	$noidung = "noidung_".$_SESSION["nn"];
	$xuatxu = "xuatxu_".$_SESSION["nn"];
	$diachi = "diachi_".$_SESSION["nn"];
	$diachi2 = "diachi2_".$_SESSION["nn"];
	$title = "title_".$_SESSION["nn"];
	$photo = "photo_".$_SESSION["nn"];
	$ngaydang = "ngaydang_".$_SESSION["nn"];
	$thoidiem = "thoidiem_".$_SESSION["nn"];
	
	$thongtin = "thongtin_".$_SESSION["nn"];
	$vitri = "vitri_".$_SESSION["nn"];
	$tienich = "tienich_".$_SESSION["nn"];
	$matbang = "matbang_".$_SESSION["nn"];
	$tiendo = "tiendo_".$_SESSION["nn"];
	$tintuc = "tintuc_".$_SESSION["nn"];
	$video = "video_".$_SESSION["nn"];
	$hinhanh = "hinhanh_".$_SESSION["nn"];
	$giaodich = "giaodich_".$_SESSION["nn"];
	$copy = "copy_".$_SESSION["nn"];
	
	date_default_timezone_set('Asia/Ho_Chi_Minh');
	error_reporting(E_ALL & ~E_NOTICE & ~8192);

	$session=session_id();
	@define ( '_template' , './templates/');
	@define ( '_source' , './sources/');
	@define ( '_lib' , './admin/lib/');

	include_once _lib."config.php";
	
	@define ( '_kiemtraweb', $check_website);  //Một đoạn mã dành riêng cho 1 website.
	
	include_once _lib."constant.php";
	include_once _lib."functions.php";
	include_once _lib."q_functions.php";	//Các hàm bổ sung
	include_once _lib."functions_giohang.php";
	include_once _lib."class.database.php";
	include_once _lib."file_requick.php";
	include_once _lib."new.php";

	if($_REQUEST['command']=='add' && $_REQUEST['productid']>0){
		$pid=$_REQUEST['productid'];
		$nid=($_REQUEST['productnum'])?$_REQUEST['productnum']:1;
			addtocart($pid,$nid);
			redirect("gio-hang.html");
	}

?>

<!DOCTYPE html>
<html>
<head>
	<head>
		<base href="http://<?=$config_url?>/" />

		<meta charset="utf-8">
		<meta name="description" content="<?=$description?>" />
		<meta name="keywords" content="<?=$keywords?>" />
		<meta name="robots" content="noodp,index,follow" />
		<meta name='revisit-after' content='7 days' />
		<meta http-equiv="content-language" content="vi" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<?php 
		$d->reset();
		$sql="select photo from #_tinnho where id=110";
		$d->query($sql);
		$favicon = $d->fetch_array();
	?>
	<link href="<?=_upload_tinnho_l.$favicon['photo']?>" rel="shortcut icon" type="image/x-icon" />
	<meta name = "viewport" content = "user-scalable=no, width=device-width">

	<meta name="author" content="" />
	<meta name="copyright" content="" />
	<?php $title_bar = str_replace("-"," ",$title_bar) ?>
	<title><?=$title_bar?></title>

	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/hover-min.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/csschung.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/menutulam.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/style.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/reponsive.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/css/font-awesome/css/font-awesome.min.css">
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/admin/media/assets/bootstrap/css/bootstrap_3.3.7.min.css">

	<!-- First, add jQuery (and jQuery UI if using custom easing or animation -->
	<!-- <?php if($com=='san-pham'){ ?>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/jquery-1.7.2.js"></script>

	<?php }else{?>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/jquery-2.2.1.js"></script>
	<?php }?> -->
	<script src="https://code.jquery.com/jquery-3.3.1.min.js" type="text/javascript"></script>

	<script type="text/javascript" src="<?php echo _root_dirname; ?>/js/jquery.mmenu.all.min.js"></script>
	<script type="text/javascript">
		$(function() {
			$('nav#menu').mmenu();
		});
	</script>

	<div id="fb-root"></div>
	<script>
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.5";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	</script>
	<?php include_once _template."layout/tienich/facebook/cauhinh_face.php"; ?>

	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/jquery.easing.1.3.js"></script>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/jquery.mousewheel.min.js"></script>   
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/media/js/ImageScroller.js"></script>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/admin/media/assets/bootstrap/js/bootstrap.min.js"></script>

	<!--wow js-->
	   	<script type="text/javascript" src="<?php echo _root_dirname; ?>/js/wow.min.js"></script>
		<script>
			new WOW().init();
		</script>
		<link rel="stylesheet" href="<?php echo _root_dirname; ?>/css/animate.css">

	<?php 
	if(@$_GET['com']=='lien-he' || @$_GET['com']=='map'){
	?>
		<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/js/tabcontent/template1/tabcontent.css">
		<link rel="stylesheet" href="<?php echo _root_dirname; ?>/media/css/map.css">
	<?php
	}
	?>

	<!--GOOGLE ANALYTICS + GOOGLE WEBMASTER-->
	<?=$company['script']?>
	<?=$company['vchat']?>
	<script type="text/javascript" src="<?php echo _root_dirname; ?>/admin/ckeditor/ckeditor.js"></script>
	<script>
		$(document).ready(function() {
			
			$('.ck_editors').each(function(index, el) {
				var id = $(this).attr('id');
				CKEDITOR.replace( id, {
				height : 500,
				entities: false,
				skin: 'moono',
		        basicEntities: false,
		        entities_greek: false,
		        entities_latin: false,
				filebrowserBrowseUrl : 'ckfinder/ckfinder.html',
				filebrowserImageBrowseUrl : 'ckfinder/ckfinder.html?type=Images',
				filebrowserFlashBrowseUrl : 'ckfinder/ckfinder.html?type=Flash',
				filebrowserUploadUrl : 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
				filebrowserImageUploadUrl : 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
				filebrowserFlashUploadUrl : 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash',
				allowedContent:
					'h1 h2 h3 h4 h5 h6 p blockquote strong em;' +
					'a[!href];' +
					'img(left,right)[!src,alt,width,height];' +
					'table tr th td caption;' +
					'span{!font-family};' +
					'span{!color};' +
					'span(!marker);' +
					'del ins'
				});

			});

		});
		
	</script>​

<!-- =========================   Add some custom for this page   =====================  -->
	<link rel="stylesheet" href="<?php echo _root_dirname; ?>/css/petition_thankyou.css">
	<script>
		$("body").delegate('#share_button', 'click', function() {
			//var parent = $(this).parent().parent();
			//var hreflink = parent.find('a#petition_title').attr('href');
			//var link = "https://www.facebook.com/sharer/sharer.php?u=" + hreflink;
			//MyPopUpShareWindow(link, 600, 650);
			alert("Not done yet");
			return false;
		});
		function MyPopUpShareWindow(url, width, height) {
		    var leftPosition, topPosition;
		    //Allow for borders.
		    leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
		    //Allow for title and status bars.
		    topPosition = (window.screen.height / 2) - ((height / 2) + 50);
		    //Open the window.
		    window.open(url, "Window2",
		    "status=no,height=" + height + ",width=" + width + ",resizable=yes,left="
		    + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY="
		    + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
		}

		$('#myCarousel').carousel({
		    interval: 10000
		})
	</script>
<!-- ================================================================================  -->

</head>

<?php 
	$d->reset();
	$sql="select photo from #_tinnho where id=53";
	$d->query($sql);
	$logotc = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=109";
	$d->query($sql);
	$bannertc = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=114";
	$d->query($sql);
	$hinhphaituvan = $d->fetch_array();


	$d->reset();
	$sql="select photo from #_tinnho where id=93";
	$d->query($sql);
	$bgfooter = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=167";
	$d->query($sql);
	$slogan = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=168";
	$d->query($sql);
	$bgbaotrongoi = $d->fetch_array();

	$d->reset();
	$sql="select photo from #_tinnho where id=169";
	$d->query($sql);
	$bgluatsutieubieu = $d->fetch_array();

?>
<?php 
	$d->reset();
	$sql="select photo from #_tinnho where id=93";
	$d->query($sql);
	$bgfooter = $d->fetch_array();
?>
<style>
	#khungbaogiatc1{width:100%;height:514px;float:left;background:url(<?=_upload_tinnho_l.$bgbaotrongoi['photo']?>)no-repeat top center}
	#khungluatsutieubieutc1{width:100%;float:left;height:770px;background:url(<?=_upload_tinnho_l.$bgluatsutieubieu['photo']?>)no-repeat top center}
	#khungslogantc1{width:100%;height:453px;background:url(<?=_upload_tinnho_l.$slogan['photo']?>)no-repeat top center;float:left}
	/* CUSTOM CSS */

</style>

<?php if($com!=''&&$com!='trang-chu'){ ?>
	<style>
	#khungdangkytuvantc1{padding-top:0px}
	</style>
<?php
}
?>

<body style="display:none">
	<?php 
		include_once _template."layout/tu/tu.php"; 
		include_once _template."layout/tienich/loadtrang.php";
	?>
	<script type="text/javascript">
	    $(document).ready(function () {
	        $(".language a").on('click', function () {
	            var language = $(this).attr('data-lang');
	            var href_cur = window.location.href;

	            $.ajax({
	                type: 'POST',
	                url: 'changelang.php',
	                data: {
	                    change: language,
	                },
	                dataType: 'html',
	                success: function (a) {
	                    if (a == 1) {
	                        location.href = href_cur;
	                    }
	                }
	            });
	        });
	    });

	</script>

	<?php if($_SESSION["nn"]=='tq'){ ?>
		<style>
		#menuchinhphai ul li{
			padding-left: 43px;
		    padding-right: 43px;}
		</style>
	<?php }?>

	<div id="wrapper">
		<div id="logodt"><a href="<?php echo _root_dirname; ?>/./"><img src="<?=_upload_tinnho_l.$logotc['photo']?>" alt="logo"/></a></div>
		<div id="menurere"><?php include_once _template."layout/menu/menure.php"; ?></div>
		<div id="headertc1">
			<div id="headertc2">
				<a href="<?php echo _root_dirname; ?>/trang-chu.html"><img id="logotc" src="<?=_upload_tinnho_l.$logotc['photo']?>" alt="logo"/></a>
				
				<div id="dangkydangnhaptc">
					<?php if($_SESSION['login1']['email']==''){ ?>
					<a href="<?php echo _root_dirname; ?>/dang-nhap.html">Đăng nhập</a>
					<a href="<?php echo _root_dirname; ?>/dang-ky.html">Đăng ký</a>
					<?php }else{?>
					<ul>
						<li>
						<a><?=$_SESSION['login1']['ten']?> <i id="isodangnhap" class="fa fa-sort-desc" aria-hidden="true"></i> </a>
							<ul>
								<li><a href="<?php echo _root_dirname; ?>/thong-tin-ca-nhan.html" >Thông tin cá nhân</a></li>
								<li><a href="<?php echo _root_dirname; ?>/doi-mat-khau.html" >Đổi mật khẩu</a></li>
								<?php if($_SESSION['login1']['phanloai']=='khachhang') {?>
								<li><a href="<?php echo _root_dirname; ?>/lich-su-cau-hoi.html" >Lịch sử câu hỏi</a></li>
								<?php } ?>
								<?php if($_SESSION['login1']['phanloai']=='luatsu') {?>
								<li><a href="<?php echo _root_dirname; ?>/xem-dat-hen.html" >Xem đặt hẹn</a></li>
								<?php } ?>
								<?php if($_SESSION['login1']['phanloai']=='luatsu') {?>
								<li><a href="<?php echo _root_dirname; ?>/viet-bai.html" >Viết bài</a></li>
								<?php } ?>
								<?php if($_SESSION['login1']['phanloai']=='luatsu') {?>
								<li><a href="<?php echo _root_dirname; ?>/luat-su/<?=($_SESSION['login1']['ten']!='')?q_bodautv($_SESSION['login1']['ten']):'-'?>-<?=$_SESSION['login1']['id']?>.html/loai=xemcauhoi" >Xem câu hỏi</a></li>
								<?php } ?>
								
								<li><a href="<?php echo _root_dirname; ?>/thoat.html" >Đăng xuất</a></li>
							</ul>		
						</li>
					</ul>
					<?php } ?>
				</div>
				<a id="chutuvanmienphitc" href="<?php echo _root_dirname; ?>/tu-van-mien-phi.html" >Tư vấn miễn phí</a>
				
				<a id="sohotlinetc" href="tel:<?=$company['dienthoai']?>">HOTLINE: <?=$company['dienthoai']?></a>
				<div id="khungtimkiemtc"><?php include_once _template."layout/timkiem/timkiem.php"; ?></div>
				
			</div>
		</div>
		<div id="menu1">
			<div id="menu2"><?php include_once _template."layout/menu/menutulam.php"; ?></div>
		</div>

		<!--Content-->
		<div class="row main_content">
			<div class="col-md-offset-1 col-md-10 middle_content">
				<div class="thank_you">
					<h1>Cảm ơn!</h1>
					<div class="petition">
						<div class="petition_textblock">
			                <p class="thank_you_title">
			                    <strong>
			                        Want to do more to support this petition?
			                    </strong>
			                </p>
			                <p class="thank_you_sub_title">SHARING makes a huge difference.</p>
			            </div>
			            <div class="share_btns row">
			            	<div class="col-md-offset-4 col-md-4">
			            		<!-- Insert Share Button Facebook Here -->
								<a href="" class="btn_share_facebook" id="share_button">
		                			<span class="fa fa-facebook"></span>&nbsp;&nbsp; Share on Facebook
		                		</a>
			            	</div>
			            </div>
			            <h2 class="recommended_title">Những Bài Liên Quan</h2>
			            <div class="recommended_slider_wrapper row">
			            	<div class="col-md-offset-1 col-md-10">
			            		<div id="theCarousel" class="carousel slide" data-ride="carousel">
							        <div class="carousel-inner">
							            <div class="item active">
						                	<div class="row">
						                		<div class="col-md-4">
						                			<a href="#x" class="thumbnail">
						                				<img src="https://cdn.ipetitions.com/user-images/petitions/put-a-stop-to-animal-experimentation-now/d2aab32de8c60823495afaa13ff99d18.jpg" alt="Image"/>
						                			</a>
						                			<div class="carousel-caption">
									                    <h4>Amazing Backgrounds</h4>
									                </div>
						                		</div>
						                		<div class="col-md-4">
						                			<a href="#x" class="thumbnail">
						                				<img src="https://cdn.ipetitions.com/user-images/petitions/no-to-a-delaware-assult-weapons-ban/b2cbc21babdc7e5897c9c7744dd0721a.png" alt="Image"/>
						                			</a>
						                			<div class="carousel-caption">
									                    <h4>Amazing Backgrounds</h4>
									                </div>
						                		</div>
						                		<div class="col-md-4">
						                			<a href="#x" class="thumbnail">
						                				<img src="https://cdn.ipetitions.com/user-images/petitions/oregonians-against-petition-43/73a6d5050668adf722937e6415998fbb.jpg" alt="Image"/>
						                			</a>
						                			<div class="carousel-caption">
									                    <h4>Amazing Backgrounds</h4>
									                </div>
						                		</div>
						                	</div><!--/row-fluid-->
							            </div>
							            <div class="item">
							                <div class="row">
						                		<div class="col-md-4">
						                			<a href="#x" class="thumbnail">
						                				<img src="https://cdn.ipetitions.com/user-images/petitions/put-a-stop-to-animal-experimentation-now/d2aab32de8c60823495afaa13ff99d18.jpg" alt="Image"/>
						                			</a>
						                			<div class="carousel-caption">
									                    <h4>Amazing Backgrounds</h4>
									                </div>
						                		</div>
						                		<div class="col-md-4">
						                			<a href="#x" class="thumbnail">
						                				<img src="https://cdn.ipetitions.com/user-images/petitions/no-to-a-delaware-assult-weapons-ban/b2cbc21babdc7e5897c9c7744dd0721a.png" alt="Image"/>
						                			</a>
						                			<div class="carousel-caption">
									                    <h4>Amazing Backgrounds</h4>
									                </div>
						                		</div>
						                		<div class="col-md-4">
						                			<a href="#x" class="thumbnail">
						                				<img src="https://cdn.ipetitions.com/user-images/petitions/oregonians-against-petition-43/73a6d5050668adf722937e6415998fbb.jpg" alt="Image"/>
						                			</a>
						                			<div class="carousel-caption">
									                    <h4>Amazing Backgrounds</h4>
									                </div>
						                		</div>
						                	</div><!--/row-fluid-->
							            </div>
							            <div class="item">
							                <div class="row">
						                		<div class="col-md-4">
						                			<a href="#x" class="thumbnail">
						                				<img src="https://cdn.ipetitions.com/user-images/petitions/put-a-stop-to-animal-experimentation-now/d2aab32de8c60823495afaa13ff99d18.jpg" alt="Image"/>
						                			</a>
						                			<div class="carousel-caption">
									                    <h4>Amazing Backgrounds</h4>
									                </div>
						                		</div>
						                		<div class="col-md-4">
						                			<a href="#x" class="thumbnail">
						                				<img src="https://cdn.ipetitions.com/user-images/petitions/no-to-a-delaware-assult-weapons-ban/b2cbc21babdc7e5897c9c7744dd0721a.png" alt="Image"/>
						                			</a>
						                			<div class="carousel-caption">
									                    <h4>Amazing Backgrounds</h4>
									                </div>
						                		</div>
						                		<div class="col-md-4">
						                			<a href="#x" class="thumbnail">
						                				<img src="https://cdn.ipetitions.com/user-images/petitions/oregonians-against-petition-43/73a6d5050668adf722937e6415998fbb.jpg" alt="Image"/>
						                			</a>
						                			<div class="carousel-caption">
									                    <h4>Amazing Backgrounds</h4>
									                </div>
						                		</div>
						                	</div><!--/row-fluid-->
							            </div>
							        </div>
							        <a href="#theCarousel" class="left carousel-control" data-slide="prev">
							            <span class="glyphicon glyphicon-chevron-left"></span>
							        </a>
							        <a href="#theCarousel" class="right carousel-control" data-slide="next">
							            <span class="glyphicon glyphicon-chevron-right"></span>
							        </a>
							    </div>
							    <div class="start_petition">
					                <div class="text_block">
					                    <p class="thank_you_title"><strong>Bạn có muốn một thỉnh nguyện thư của bạn?</strong></p>
					                    <p class="thank_you_sub_title">Nó miễn phí và chỉ mất vài phút.</p>
					                </div>
					                <a class="action_button icon-pencil" href="<?php echo _root_dirname; ?>/petition_registration.php">
					                	<span class="glyphicon glyphicon-edit icon_editPet"></span>Viết Một Thỉnh Nguyện Thư
					                </a>
					            </div>
			            	</div>
		            	</div>
					</div>
				</div>
			</div>
		</div>
		<br>
		<!--End Content-->

		<div id="footertc1">
			<div id="footertc2">
				<div id="footermot">
					<div class="tieudefooter"><h3><a><?=$company['ten_vi']?></a></h3></div>
					<div class="noidungfooter noidungfootermot">
					<?=$company[$mota]?>
					</div>
				</div>
				<div id="footerhai">
					<div class="tieudefooter"><h3><a>Dịch vụ nổi bật</a></h3></div>
					<div class="noidungfooter noidungfooterhai">
						<ul>
							<li><a href="<?php echo _root_dirname; ?>/tu-van-mien-phi.html">Tư viến miễn phí</a></li>
							<li><a href="<?php echo _root_dirname; ?>/tim-luat-su.html">Tìm kiếm luật sư</a></li>
							<li><a href="<?php echo _root_dirname; ?>/bao-gia-vu-viec.html">Báo giá vụ việc trọn gói</a></li> 
						</ul>
					</div> 
				</div>
				
				<div id="footerba">
					<div class="tieudefooter"><h3><a>Chính sách và hỗ trợ</a></h3></div>
					<div class="noidungfooter noidungfooterhai">
						<ul>
							<?php 
								$d->reset();
								$sql="select * from #_tinnho where hienthi=1 and com=7 order by stt asc";
								$d->query($sql);
								$chinhsachhotrotc = $d->result_array();
							?>
							<?php for($i=0;$i<count($chinhsachhotrotc);$i++){ 
								$v = $chinhsachhotrotc[$i];
							?>
							<li><a href="<?php echo _root_dirname; ?>/chinh-sach-ho-tro/<?=$v['tenkhongdau']?>-<?=$v['id']?>.html"><?=$v[$ten]?></a></li>
							<?php }?>
							
						</ul>
					</div> 
				</div>
				
				<div id="footerbon">
					<div class="tieudefooter"><h3><a>Liên Hệ</a></h3></div>
					<div class="noidungfooter noidungfootermot">
						<?=$company[$noidung]?>
					</div> 
				</div>
				
				<div id="mapfooter">
					<div class="tieudefooter"><h3><a>Bản đồ</a></h3></div>
					<div class="noidungfooter">
						<?php
			                $sql = "select * from #_company where com='toado' order by stt asc, id desc limit 0,1";
			                $d->query($sql);
			                $toado = $d->fetch_array();	
			            ?>
						<?=$toado['website']?>
					</div>	
				</div>
			</div>
		</div>
	</div>

	<script src="<?php echo _root_dirname; ?>/js/petition_thankyou.js" type="text/javascript"></script>

</body>
</html>